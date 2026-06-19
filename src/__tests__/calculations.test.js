/**
 * @fileoverview Comprehensive tests for all calculation utility functions.
 * Tests cover edge cases, boundary conditions, and all classification buckets.
 */
import {
  getTotalKg,
  getWorldHealth,
  getXpForAction,
  getEquivalent,
  getCO2Level,
  getLevelInfo,
  formatKg,
  SUSTAINABLE_TARGET,
  GLOBAL_AVERAGE,
  INDIA_AVERAGE,
} from '../utils/calculations'

describe('calculations utility', () => {

  // ─── getTotalKg ───────────────────────────────────────────────────────────

  describe('getTotalKg', () => {
    it('sums all categories correctly', () => {
      expect(getTotalKg({ transport: 2, food: 3, energy: 1 })).toBe(6)
    })

    it('returns 0 for all-zero footprint', () => {
      expect(getTotalKg({ transport: 0, food: 0, energy: 0 })).toBe(0)
    })

    it('rounds to 1 decimal place', () => {
      expect(getTotalKg({ transport: 1.1, food: 1.1, energy: 1.1 })).toBe(3.3)
    })

    it('handles a single category', () => {
      expect(getTotalKg({ transport: 5 })).toBe(5)
    })
  })

  // ─── getWorldHealth ───────────────────────────────────────────────────────

  describe('getWorldHealth', () => {
    it('returns 100 for zero footprint with no streak', () => {
      expect(getWorldHealth({ transport: 0 }, 0)).toBe(100)
    })

    it('returns 0 for very high footprint', () => {
      expect(getWorldHealth({ transport: 20 }, 0)).toBe(0)
    })

    it('increases score with higher streak', () => {
      const base = getWorldHealth({ transport: 4 }, 0)
      const streaked = getWorldHealth({ transport: 4 }, 5)
      expect(streaked).toBeGreaterThan(base)
    })

    it('caps streak bonus at 20 points', () => {
      const streaked10 = getWorldHealth({ transport: 0 }, 10)
      const streaked100 = getWorldHealth({ transport: 0 }, 100)
      expect(streaked10).toBe(streaked100)
    })

    it('never exceeds 100', () => {
      expect(getWorldHealth({ transport: 0 }, 999)).toBe(100)
    })
  })

  // ─── getXpForAction ───────────────────────────────────────────────────────

  describe('getXpForAction', () => {
    it('returns minimum 10 XP for 0 impact', () => {
      expect(getXpForAction(0)).toBe(10)
    })

    it('is proportional to impact', () => {
      expect(getXpForAction(1)).toBe(30)
      expect(getXpForAction(2)).toBe(50)
    })

    it('scales correctly for high-impact actions', () => {
      expect(getXpForAction(5)).toBe(110)
    })
  })

  // ─── getEquivalent ────────────────────────────────────────────────────────

  describe('getEquivalent', () => {
    it('returns banana equivalent for tiny amounts', () => {
      expect(getEquivalent(0.05)).toContain('banana')
    })

    it('returns streaming equivalent for sub-1kg amounts', () => {
      expect(getEquivalent(0.5)).toContain('HD streaming')
    })

    it('returns beef meal equivalent for 3-8 kg range', () => {
      expect(getEquivalent(3)).toContain('beef meals')
    })

    it('returns flight equivalent for large amounts', () => {
      expect(getEquivalent(10)).toContain('hours in a plane')
    })

    it('returns driving equivalent for 1-3 kg range', () => {
      expect(getEquivalent(1.5)).toContain('km')
    })
  })

  // ─── getCO2Level ──────────────────────────────────────────────────────────

  describe('getCO2Level', () => {
    it('returns Sustainable for <= 4 kg', () => {
      expect(getCO2Level(3).label).toBe('Sustainable')
      expect(getCO2Level(4).label).toBe('Sustainable')
    })

    it('returns Below average for 5-7 kg', () => {
      expect(getCO2Level(6).label).toBe('Below average')
    })

    it('returns Moderate for 8-10 kg', () => {
      expect(getCO2Level(10).label).toBe('Moderate')
    })

    it('returns High for 11-14 kg', () => {
      expect(getCO2Level(12).label).toBe('High')
    })

    it('returns Critical for > 14 kg', () => {
      expect(getCO2Level(15).label).toBe('Critical')
    })

    it('includes color and bg properties', () => {
      const level = getCO2Level(3)
      expect(level).toHaveProperty('color')
      expect(level).toHaveProperty('bg')
    })
  })

  // ─── getLevelInfo ─────────────────────────────────────────────────────────

  describe('getLevelInfo', () => {
    it('returns level 1 for 0 XP', () => {
      expect(getLevelInfo(0).level).toBe(1)
    })

    it('returns level 2 for 200 XP', () => {
      expect(getLevelInfo(200).level).toBe(2)
    })

    it('returns level 5 for very high XP', () => {
      expect(getLevelInfo(9999).level).toBe(5)
    })

    it('includes a title string', () => {
      expect(getLevelInfo(0).title).toBe('Newcomer')
      expect(getLevelInfo(2000).title).toBe('Earth Guardian')
    })
  })

  // ─── formatKg ─────────────────────────────────────────────────────────────

  describe('formatKg', () => {
    it('rounds to 1 decimal place', () => {
      expect(formatKg(2.73)).toBe(2.7)
    })

    it('handles exact values', () => {
      expect(formatKg(5.0)).toBe(5)
    })
  })

  // ─── constants ────────────────────────────────────────────────────────────

  describe('exported constants', () => {
    it('SUSTAINABLE_TARGET is 4.0', () => {
      expect(SUSTAINABLE_TARGET).toBe(4.0)
    })

    it('GLOBAL_AVERAGE is greater than SUSTAINABLE_TARGET', () => {
      expect(GLOBAL_AVERAGE).toBeGreaterThan(SUSTAINABLE_TARGET)
    })

    it('INDIA_AVERAGE is between sustainable target and global average', () => {
      expect(INDIA_AVERAGE).toBeGreaterThan(SUSTAINABLE_TARGET)
      expect(INDIA_AVERAGE).toBeLessThan(GLOBAL_AVERAGE)
    })
  })
})
