import { getTotalKg, GLOBAL_AVERAGE, INDIA_AVERAGE, SUSTAINABLE_TARGET } from './calculations'

const SYSTEM_PROMPT = `You are EcoAI, a warm and practical carbon footprint advisor. 
Your job is to make climate data feel personal, urgent, and actionable — not preachy or abstract.

Rules:
- Always translate kg CO₂ into relatable analogies (km driven, meals, phone charges, trees)
- Give 2–3 specific next steps, never generic advice
- Be encouraging — celebrate any progress
- Keep responses under 120 words
- Use simple conversational language
- Never be preachy or guilt-trip the user`

const buildContext = (footprint, completedActions, streak) => {
  const total = getTotalKg(footprint)
  const biggest = Object.entries(footprint).sort((a, b) => b[1] - a[1])[0]
  return `
User's current footprint context:
- Total today: ${total} kg CO₂ (global avg: ${GLOBAL_AVERAGE}, India avg: ${INDIA_AVERAGE}, target: ${SUSTAINABLE_TARGET})
- Biggest source: ${biggest[0]} (${biggest[1]} kg)
- Breakdown: transport ${footprint.transport}kg, food ${footprint.food}kg, energy ${footprint.energy}kg, shopping ${footprint.shopping}kg, digital ${footprint.digital}kg
- Day streak: ${streak} days
- Actions completed today: ${completedActions.length > 0 ? completedActions.map(a => a.title).join(', ') : 'none yet'}
`
}

export const callEcoAI = async (messages, footprint, completedActions, streak) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('API key not configured')

  const context = buildContext(footprint, completedActions, streak)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: SYSTEM_PROMPT + '\n\n' + context,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'API error')
  }

  const data = await response.json()
  return data.content[0].text
}
