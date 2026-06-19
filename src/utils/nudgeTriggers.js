export const evaluateNudges = (footprint, completedActions, forceDate = null) => {
  const hour = (forceDate || new Date()).getHours()
  const nudges = []
  const done = completedActions.map(a => a.category)

  if (hour >= 7 && hour <= 10 && !done.includes('transport')) {
    nudges.push({
      id: 'transport-morning',
      type: 'transport',
      title: 'Morning commute tip',
      message: `Your drive emits ${footprint.transport.toFixed(1)} kg CO₂. Taking the bus cuts that by 70%.`,
      icon: '🚌',
      urgency: footprint.transport > 4 ? 'high' : 'medium',
      action: 'Take public transit today',
    })
  }

  if (hour >= 11 && hour <= 13 && !done.includes('food')) {
    nudges.push({
      id: 'food-lunch',
      type: 'food',
      title: 'Lunchtime choice',
      message: 'A plant-based lunch saves 1.5 kg CO₂ — like unplugging your fridge for a day.',
      icon: '🥗',
      urgency: 'medium',
      action: 'Eat one plant-based meal',
    })
  }

  if (footprint.transport > 4.5) {
    nudges.push({
      id: 'transport-high',
      type: 'transport',
      title: 'Transport is your biggest impact',
      message: `At ${footprint.transport.toFixed(1)} kg, transport is driving 48% of your footprint. One bus ride changes that.`,
      icon: '🚗',
      urgency: 'high',
      action: 'Take public transit today',
    })
  }

  if (footprint.food > 3.5) {
    nudges.push({
      id: 'food-high',
      type: 'food',
      title: 'Food choices add up fast',
      message: `${footprint.food.toFixed(1)} kg from food today. Going meat-free once a week saves 130 kg CO₂ per year.`,
      icon: '🍖',
      urgency: 'medium',
      action: 'Eat one plant-based meal',
    })
  }

  return nudges.slice(0, 2)
}
