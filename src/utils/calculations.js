/**
 * @fileoverview Carbon footprint calculation utilities for EcoSelf.
 * All weight values are in kilograms of CO₂ equivalent (kg CO₂e).
 * @module calculations
 */

/** @constant {number} Daily sustainable carbon target per person (kg CO₂e) */
export const SUSTAINABLE_TARGET = 4.0

/** @constant {number} Global average daily carbon footprint per person (kg CO₂e) */
export const GLOBAL_AVERAGE = 11.5

/** @constant {number} India average daily carbon footprint per person (kg CO₂e) */
export const INDIA_AVERAGE = 5.2

/**
 * Sums all category values from a footprint object to get the total daily kg CO₂e.
 * @param {Object} footprint - Map of category names to kg CO₂e values.
 * @returns {number} Total footprint in kg CO₂e, rounded to 1 decimal place.
 * @example
 * getTotalKg({ transport: 2, food: 3, energy: 1 }) // => 6
 */
export const getTotalKg = (footprint) =>
  parseFloat(Object.values(footprint).reduce((a, b) => a + b, 0).toFixed(1))

/**
 * Calculates a 0-100 world health score based on daily footprint and streak.
 * Higher scores mean a healthier planet impact. Streaks provide a bonus.
 * @param {Object} footprint - Map of category names to kg CO₂e values.
 * @param {number} [streak=0] - Number of consecutive active days.
 * @returns {number} World health score between 0 and 100 (inclusive).
 */
export const getWorldHealth = (footprint, streak = 0) => {
  const total = getTotalKg(footprint)
  const base = Math.max(0, 100 - ((total / SUSTAINABLE_TARGET) * 25))
  const bonus = Math.min(streak * 2, 20)
  return Math.min(100, Math.round(base + bonus))
}

/**
 * Computes experience points (XP) awarded for completing an action.
 * XP scales proportionally with the CO₂ impact of the action.
 * @param {number} impactKg - The CO₂ impact of the action in kg.
 * @returns {number} XP reward (minimum 10 XP for any action).
 */
export const getXpForAction = (impactKg) => Math.round(impactKg * 20) + 10

/**
 * Returns a human-readable equivalence string for a given CO₂ amount.
 * Translates abstract kg CO₂ values into relatable real-world comparisons.
 * @param {number} kg - CO₂ amount in kilograms.
 * @returns {string} A descriptive equivalence string.
 * @example
 * getEquivalent(0.05) // "50g — lighter than a banana"
 * getEquivalent(5)    // "like 2 beef meals"
 */
export const getEquivalent = (kg) => {
  if (kg < 0.2) return `${Math.round(kg * 1000)}g — lighter than a banana`
  if (kg < 1) return `like ${Math.round(kg / 0.036)} hours of HD streaming`
  if (kg < 3) return `like driving ${Math.round(kg / 0.21)} km in a car`
  if (kg < 8) return `like ${Math.round(kg / 2.5)} beef meals`
  return `like flying ${Math.round(kg / 90)} hours in a plane`
}

/**
 * Classifies a daily CO₂ total into a labeled severity bucket with associated colors.
 * @param {number} kg - Total daily CO₂ in kilograms.
 * @returns {{ label: string, color: string, bg: string }} Severity classification object.
 */
export const getCO2Level = (kg) => {
  if (kg <= 4) return { label: 'Sustainable', color: '#16a34a', bg: '#dcfce7' }
  if (kg <= 7) return { label: 'Below average', color: '#65a30d', bg: '#ecfccb' }
  if (kg <= 10) return { label: 'Moderate', color: '#d97706', bg: '#fef3c7' }
  if (kg <= 14) return { label: 'High', color: '#ea580c', bg: '#ffedd5' }
  return { label: 'Critical', color: '#dc2626', bg: '#fee2e2' }
}

/**
 * Returns gamification level info for a given XP total.
 * @param {number} xp - User's current total experience points.
 * @returns {{ level: number, title: string, min: number, max: number }} Level data object.
 */
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

/**
 * Rounds a kg CO₂ value to 1 decimal place for consistent display.
 * @param {number} kg - Raw CO₂ value in kilograms.
 * @returns {number} Value rounded to 1 decimal place.
 */
export const formatKg = (kg) => parseFloat(kg.toFixed(1))
