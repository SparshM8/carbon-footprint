/**
 * @fileoverview EcoAI advisor integration for EcoSelf.
 * Powered by Google Gemini Flash API to provide personalized, contextual
 * carbon footprint coaching. Builds a rich system prompt from the
 * user's live footprint data and conversation history.
 * Includes intelligent offline fallback when API key is not configured.
 * @module aiAdvisor
 */

import { getTotalKg, GLOBAL_AVERAGE, INDIA_AVERAGE, SUSTAINABLE_TARGET, getEquivalent } from './calculations'

/**
 * The system persona prompt that shapes EcoAI's tone and response style.
 * Ensures responses are concise, actionable, and encouraging — never preachy.
 * @constant {string}
 */
export const SYSTEM_PROMPT = `You are EcoAI, a warm and practical carbon footprint advisor powered by Gemini Flash 3.8. 
Your job is to make climate data feel personal, urgent, and actionable — not preachy or abstract.

Rules:
- Always translate kg CO₂ into relatable analogies (km driven, meals, phone charges, trees)
- Give 2–3 specific next steps, never generic advice
- Be encouraging — celebrate any progress
- Keep responses under 130 words
- Use simple conversational language with markdown formatting
- Never be preachy or guilt-trip the user`

/**
 * Builds a structured context block from the user's live state for injection
 * into the AI system prompt so Gemini has full situational awareness.
 *
 * @param {Object} footprint - Map of category names to kg CO₂e values.
 * @param {Array<{title: string}>} completedActions - Actions completed today.
 * @param {number} streak - User's current daily activity streak.
 * @returns {string} Formatted context string for the system prompt.
 */
export const buildContext = (footprint = {}, completedActions = [], streak = 0) => {
  const total = getTotalKg(footprint)
  const entries = Object.entries(footprint)
  const biggest = entries.length > 0 ? entries.sort((a, b) => b[1] - a[1])[0] : ['none', 0]
  return `
User's current footprint context:
- Total today: ${total} kg CO₂ (global avg: ${GLOBAL_AVERAGE}, India avg: ${INDIA_AVERAGE}, target: ${SUSTAINABLE_TARGET})
- Biggest source: ${biggest[0]} (${biggest[1]} kg)
- Breakdown: transport ${footprint.transport ?? 0}kg, food ${footprint.food ?? 0}kg, energy ${footprint.energy ?? 0}kg, shopping ${footprint.shopping ?? 0}kg, digital ${footprint.digital ?? 0}kg
- Day streak: ${streak} days
- Actions completed today: ${completedActions.length > 0 ? completedActions.map(a => a.title).join(', ') : 'none yet'}
`
}

/**
 * Generates an intelligent, context-aware simulation reply when Gemini API is offline or keyless.
 *
 * @param {string} query - The user prompt.
 * @param {Object} footprint - User's current daily footprint data.
 * @param {Array<{title: string}>} completedActions - Actions completed today.
 * @param {number} streak - Current streak in days.
 * @returns {string} Contextual AI advisor reply.
 */
export const generateOfflineGeminiResponse = (query = '', footprint = {}, completedActions = [], streak = 0) => {
  const total = getTotalKg(footprint)
  const entries = Object.entries(footprint)
  const biggest = entries.length > 0 ? entries.sort((a, b) => b[1] - a[1])[0] : ['transport', 3.0]
  const q = query.toLowerCase()

  if (q.includes('compare') || q.includes('india') || q.includes('average')) {
    const diffIndia = (total - INDIA_AVERAGE).toFixed(1)
    const vsIndiaText = total <= INDIA_AVERAGE
      ? `You are currently **${Math.abs(diffIndia)} kg below** the Indian average (${INDIA_AVERAGE} kg) — fantastic work! 🌟`
      : `You are currently **${diffIndia} kg above** the Indian average (${INDIA_AVERAGE} kg).`
    return `${vsIndiaText}\n\nCompared to the global average of ${GLOBAL_AVERAGE} kg, you are saving **${Math.max(0, Math.round(((GLOBAL_AVERAGE - total) / GLOBAL_AVERAGE) * 100))}%** of emissions.\n\nTo inch closer to our 1.5°C climate target of **${SUSTAINABLE_TARGET} kg/day**, targeting your top emission category (**${biggest[0]}**) is your fastest win.`
  }

  if (q.includes('plan') || q.includes('7-day') || q.includes('schedule')) {
    return `Here is your personalised **7-Day Gemini Reduction Plan** based on your current top source (${biggest[0]} at ${biggest[1]} kg):\n\n1. **Days 1–2 (Transport):** Try public transit or carpooling for 2 commutes — saves ~3.6 kg CO₂ (equal to driving 17 km less).\n2. **Days 3–4 (Food):** Swap two lunches to plant-based meals — cuts ~3.0 kg CO₂.\n3. **Days 5–7 (Home):** Adjust AC by +2°C and unplug idle electronics overnight — saves ~1.6 kg CO₂.\n\nExecuting this plan could cut your footprint by **~8 kg this week**! 🚀`
  }

  if (q.includes('biggest') || q.includes('mean') || q.includes('real life')) {
    const equiv = getEquivalent(biggest[1])
    return `Your biggest emission source right now is **${biggest[0].toUpperCase()}** at **${biggest[1]} kg CO₂** today.\n\nIn real-world terms, that's ${equiv}!\n\nBecause ${biggest[0]} represents the lion's share of your footprint, reducing it by just 25% will bring your overall daily impact down significantly. Check the Action Center for challenges in this category.`
  }

  if (q.includes('single change') || q.includes('help me most') || q.includes('lever')) {
    if (biggest[0] === 'transport') {
      return `Your single highest-impact change today is **switching your primary commute**.\n\nReplacing just 15 km of solo driving with the bus or metro cuts ~1.8 kg CO₂ immediately — that's like taking a small car off the road for an entire week! Check today's transit challenge to log it.`
    }
    if (biggest[0] === 'food') {
      return `Your biggest lever is **one plant-based swap** today.\n\nReplacing a single meat meal with lentils or tofu saves up to 2.0 kg CO₂, which offsets nearly 50 hours of continuous LED lighting. Small culinary switch, giant climate return! 🥗`
    }
    return `Your highest-yield lever is **cutting ${biggest[0]}**! Trimming it by just 1 kg puts your total below the national benchmark. Check the Action Center for today's quick wins!`
  }

  // General contextual coaching
  return `Hi! EcoAI (powered by Gemini Flash) here. Your total footprint today is **${total} kg CO₂** with a **${streak}-day streak** 🔥.\n\nYour highest emission area is **${biggest[0]}** (${biggest[1]} kg). ${completedActions.length > 0 ? `You've already completed ${completedActions.length} action(s) today — keep the momentum going!` : 'Completing just one challenge today can trim up to 2.1 kg CO₂.'}\n\nWhat specific part of your footprint would you like to tackle next?`
}

/**
 * Calls the Google Gemini Flash API to generate a personalized EcoAI response.
 * Uses VITE_GEMINI_API_KEY environment variable if available, or falls back to
 * the built-in intelligent Gemini response engine.
 *
 * @async
 * @param {Array<{role: string, content: string}>} messages - Conversation history.
 * @param {Object} footprint - User's current daily footprint data.
 * @param {Array<{title: string}>} completedActions - Actions completed today.
 * @param {number} streak - Current user activity streak in days.
 * @param {Object} [options={}] - Optional configuration flags.
 * @param {boolean} [options.allowFallback=false] - If true, fallback to local simulator on missing key.
 * @returns {Promise<string>} The AI-generated response text.
 * @throws {Error} If the API key is missing and allowFallback is false, or if API fails.
 */
export const callEcoAI = async (messages, footprint = {}, completedActions = [], streak = 0, options = {}) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'

  if (!apiKey) {
    if (options.allowFallback) {
      const latestMsg = messages[messages.length - 1]?.content || ''
      return generateOfflineGeminiResponse(latestMsg, footprint, completedActions, streak)
    }
    throw new Error('API key not configured')
  }

  const context = buildContext(footprint, completedActions, streak)

  // Map conversation messages to Gemini format (roles: 'user' | 'model')
  const contents = messages.map(m => ({
    role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT + '\n\n' + context }],
      },
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Hello' }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 350,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Gemini API error (${response.status})`)
  }

  const data = await response.json()
  const candidate = data.candidates?.[0]
  const reply = candidate?.content?.parts?.[0]?.text

  if (!reply) {
    throw new Error('No response returned by Gemini model')
  }

  return reply
}
