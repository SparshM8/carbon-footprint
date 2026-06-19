export const SUSTAINABLE_TARGET = 4.0
export const GLOBAL_AVERAGE = 11.5
export const INDIA_AVERAGE = 5.2

export const getTotalKg = (footprint) =>
  parseFloat(Object.values(footprint).reduce((a, b) => a + b, 0).toFixed(1))

export const getWorldHealth = (footprint, streak = 0) => {
  const total = getTotalKg(footprint)
  const base = Math.max(0, 100 - ((total / SUSTAINABLE_TARGET) * 25))
  const bonus = Math.min(streak * 2, 20)
  return Math.min(100, Math.round(base + bonus))
}

export const getXpForAction = (impactKg) => Math.round(impactKg * 20) + 10

export const getEquivalent = (kg) => {
  if (kg < 0.2) return `${Math.round(kg * 1000)}g — lighter than a banana`
  if (kg < 1) return `like ${Math.round(kg / 0.036)} hours of HD streaming`
  if (kg < 3) return `like driving ${Math.round(kg / 0.21)} km in a car`
  if (kg < 8) return `like ${Math.round(kg / 2.5)} beef meals`
  return `like flying ${Math.round(kg / 90)} hours in a plane`
}

export const getCO2Level = (kg) => {
  if (kg <= 4) return { label: 'Sustainable', color: '#16a34a', bg: '#dcfce7' }
  if (kg <= 7) return { label: 'Below average', color: '#65a30d', bg: '#ecfccb' }
  if (kg <= 10) return { label: 'Moderate', color: '#d97706', bg: '#fef3c7' }
  if (kg <= 14) return { label: 'High', color: '#ea580c', bg: '#ffedd5' }
  return { label: 'Critical', color: '#dc2626', bg: '#fee2e2' }
}

export const getLevelInfo = (xp) => {
  const levels = [
    { level: 1, title: 'Newcomer', min: 0, max: 200 },
    { level: 2, title: 'Aware', min: 200, max: 500 },
    { level: 3, title: 'Reducing', min: 500, max: 1000 },
    { level: 4, title: 'Eco Champion', min: 1000, max: 2000 },
    { level: 5, title: 'Earth Guardian', min: 2000, max: 9999 },
  ]
  return levels.find(l => xp >= l.min && xp < l.max) || levels[4]
}

export const formatKg = (kg) => parseFloat(kg.toFixed(1))
