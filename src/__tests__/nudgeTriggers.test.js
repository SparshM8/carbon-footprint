/**
 * @fileoverview Comprehensive tests for the nudge trigger evaluation engine.
 * Tests cover time-of-day logic, footprint severity, action suppression,
 * and the optional forceDate parameter used for deterministic testing.
 */
import { evaluateNudges } from '../utils/nudgeTriggers'

describe('nudgeTriggers utility', () => {
  const highFootprint = { transport: 5, food: 4, energy: 1 }
  const lowFootprint = { transport: 1, food: 1, energy: 1 }

  // ─── Time-based nudges ────────────────────────────────────────────────────

  describe('time-based nudge triggers', () => {
    it('transport nudge fires at 8am with high footprint', () => {
      const date = new Date()
      date.setHours(8)
      const nudges = evaluateNudges(highFootprint, [], date)
      expect(nudges.some(n => n.type === 'transport')).toBe(true)
    })

    it('food nudge fires at 11am', () => {
      const date = new Date()
      date.setHours(11, 30)
      const nudges = evaluateNudges(highFootprint, [], date)
      expect(nudges.some(n => n.type === 'food')).toBe(true)
    })

    it('transport morning nudge does NOT fire at 3pm', () => {
      const date = new Date()
      date.setHours(15)
      const nudges = evaluateNudges(lowFootprint, [], date)
      expect(nudges.some(n => n.id === 'transport-morning')).toBe(false)
    })

    it('food lunch nudge does NOT fire at 8am', () => {
      const date = new Date()
      date.setHours(8)
      const nudges = evaluateNudges(lowFootprint, [], date)
      expect(nudges.some(n => n.id === 'food-lunch')).toBe(false)
    })
  })

  // ─── Urgency levels ───────────────────────────────────────────────────────

  describe('nudge urgency levels', () => {
    it('morning transport nudge has HIGH urgency for transport > 4', () => {
      const date = new Date()
      date.setHours(8)
      const nudges = evaluateNudges(highFootprint, [], date)
      const n = nudges.find(n => n.id === 'transport-morning')
      expect(n.urgency).toBe('high')
    })

    it('morning transport nudge has MEDIUM urgency for low footprint', () => {
      const date = new Date()
      date.setHours(8)
      const nudges = evaluateNudges(lowFootprint, [], date)
      const n = nudges.find(n => n.id === 'transport-morning')
      expect(n.urgency).toBe('medium')
    })
  })

  // ─── Completed action suppression ─────────────────────────────────────────

  describe('action completion suppression', () => {
    it('completed transport action suppresses morning nudge', () => {
      const date = new Date()
      date.setHours(8)
      const nudges = evaluateNudges(highFootprint, [{ category: 'transport' }], date)
      expect(nudges.some(n => n.id === 'transport-morning')).toBe(false)
    })

    it('completed food action suppresses lunch nudge', () => {
      const date = new Date()
      date.setHours(11)
      const nudges = evaluateNudges(highFootprint, [{ category: 'food' }], date)
      expect(nudges.some(n => n.id === 'food-lunch')).toBe(false)
    })
  })

  // ─── High footprint persistent nudges ─────────────────────────────────────

  describe('persistent high-footprint nudges', () => {
    it('transport-high nudge fires when transport > 4.5 regardless of time', () => {
      const date = new Date()
      date.setHours(20) // evening — no time-based nudges
      const nudges = evaluateNudges(highFootprint, [], date)
      expect(nudges.some(n => n.id === 'transport-high')).toBe(true)
    })

    it('food-high nudge fires when food > 3.5', () => {
      const date = new Date()
      date.setHours(20)
      const nudges = evaluateNudges(highFootprint, [], date)
      expect(nudges.some(n => n.id === 'food-high')).toBe(true)
    })

    it('no persistent nudges fire for low footprint', () => {
      const date = new Date()
      date.setHours(20)
      const nudges = evaluateNudges(lowFootprint, [], date)
      expect(nudges.length).toBe(0)
    })
  })

  // ─── Result limits ────────────────────────────────────────────────────────

  describe('nudge result limits', () => {
    it('never returns more than 2 nudges', () => {
      const date = new Date()
      date.setHours(8) // triggers time + persistent nudges
      const nudges = evaluateNudges(highFootprint, [], date)
      expect(nudges.length).toBeLessThanOrEqual(2)
    })

    it('returns empty array when no conditions are met', () => {
      const date = new Date()
      date.setHours(20)
      expect(evaluateNudges(lowFootprint, [], date)).toHaveLength(0)
    })
  })

  // ─── Nudge shape ──────────────────────────────────────────────────────────

  describe('nudge object structure', () => {
    it('nudge has all required fields', () => {
      const date = new Date()
      date.setHours(8)
      const nudges = evaluateNudges(highFootprint, [], date)
      const nudge = nudges[0]
      expect(nudge).toHaveProperty('id')
      expect(nudge).toHaveProperty('type')
      expect(nudge).toHaveProperty('title')
      expect(nudge).toHaveProperty('message')
      expect(nudge).toHaveProperty('icon')
      expect(nudge).toHaveProperty('urgency')
      expect(nudge).toHaveProperty('action')
    })
  })
})
