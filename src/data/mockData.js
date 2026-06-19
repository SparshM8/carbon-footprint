export const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, i) => ({
    day,
    transport: parseFloat((Math.random() * 3 + 1.5).toFixed(1)),
    food: parseFloat((Math.random() * 2.5 + 1.5).toFixed(1)),
    energy: parseFloat((Math.random() * 1.5 + 1).toFixed(1)),
    shopping: parseFloat((Math.random() * 1.5 + 0.3).toFixed(1)),
    digital: parseFloat((Math.random() * 0.5 + 0.1).toFixed(1)),
    goal: 9.5,
  }))
}

export const CATEGORY_META = {
  transport: {
    label: 'Transport',
    icon: '🚗',
    color: '#3b82f6',
    tailwind: 'bg-blue-500',
    unit: 'kg CO₂/day',
    tips: [
      'Carpooling with 3 others cuts your transport emissions by 75%',
      'Electric vehicles emit ~60% less CO₂ than petrol cars',
      'One transatlantic flight = 3 months of daily commuting',
    ],
    avgGlobal: 4.2,
  },
  food: {
    label: 'Food',
    icon: '🍽️',
    color: '#f59e0b',
    tailwind: 'bg-amber-500',
    unit: 'kg CO₂/day',
    tips: [
      'Beef emits 20x more CO₂ than beans per gram of protein',
      'Local seasonal produce cuts food emissions by up to 30%',
      'Food waste accounts for 8% of global greenhouse gases',
    ],
    avgGlobal: 3.1,
  },
  energy: {
    label: 'Home Energy',
    icon: '⚡',
    color: '#8b5cf6',
    tailwind: 'bg-violet-500',
    unit: 'kg CO₂/day',
    tips: [
      'LED bulbs use 75% less energy than incandescent',
      'Unplugging devices on standby saves ~10% on electricity bills',
      'Solar panels offset ~1 tonne of CO₂ per year on average',
    ],
    avgGlobal: 2.3,
  },
  shopping: {
    label: 'Shopping',
    icon: '🛍️',
    color: '#ec4899',
    tailwind: 'bg-pink-500',
    unit: 'kg CO₂/day',
    tips: [
      'Fast fashion produces 10% of global carbon emissions',
      'Buying second-hand extends product life and saves 80% emissions',
      'One new smartphone = ~70 kg CO₂ to manufacture',
    ],
    avgGlobal: 1.8,
  },
  digital: {
    label: 'Digital',
    icon: '💻',
    color: '#14b8a6',
    tailwind: 'bg-teal-500',
    unit: 'kg CO₂/day',
    tips: [
      'Streaming HD video for 1 hour = ~36g CO₂',
      'Sending 65 emails = driving 1km in a car',
      'Cloud data centers use ~1% of global electricity',
    ],
    avgGlobal: 0.6,
  },
}

export const EQUIVALENTS = [
  { value: 1, icon: '☕', label: 'cups of coffee produced' },
  { value: 4, icon: '🚗', label: 'km driven in a car' },
  { value: 8, icon: '📱', label: 'hours of Netflix HD' },
  { value: 0.5, icon: '🌳', label: 'trees needed for one day' },
  { value: 100, icon: '💡', label: 'hours of LED lighting' },
]

export const GLOBAL_AVERAGE = 11.5 // kg CO2/day per person globally
export const SUSTAINABLE_TARGET = 4.0 // kg CO2/day (1.5°C pathway)
export const INDIA_AVERAGE = 5.2 // kg CO2/day

export const AI_SYSTEM_PROMPT = `You are EcoAI, a friendly and knowledgeable carbon footprint advisor for the EcoSelf platform. 

Your role is to:
1. Help users understand their personal carbon footprint in relatable, emotional terms
2. Provide specific, actionable advice tailored to their lifestyle
3. Make climate data feel personal and urgent, not abstract
4. Celebrate small wins and progress
5. Be encouraging but honest about impact

Key facts to use:
- Global average: 11.5 kg CO₂/day per person
- Sustainable target: 4 kg CO₂/day (1.5°C climate pathway)  
- India average: 5.2 kg CO₂/day
- Transport: biggest individual emission source (4.2 kg average)
- Food: second largest (3.1 kg average)

Always:
- Use analogies to make numbers tangible (trees, car km, flights)
- Acknowledge emotional barriers (convenience, cost, habit)
- Give 2-3 specific next steps, not generic advice
- Be warm and conversational, never preachy
- Celebrate any positive action taken

The user's current footprint context will be provided in each message. Keep responses concise (under 150 words).`
