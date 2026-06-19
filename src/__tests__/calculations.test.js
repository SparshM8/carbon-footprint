import { getTotalKg, getWorldHealth, getXpForAction, getEquivalent, getCO2Level } from '../utils/calculations'

describe('calculations utility', () => {
  it('getTotalKg sums all categories correctly', () => {
    const footprint = { transport: 2, food: 3, energy: 1 }
    expect(getTotalKg(footprint)).toBe(6)
  })

  it('getWorldHealth returns 0-100', () => {
    expect(getWorldHealth({ transport: 0 }, 0)).toBe(100)
    expect(getWorldHealth({ transport: 20 }, 0)).toBe(0)
  })

  it('getWorldHealth increases with streak', () => {
    const baseHealth = getWorldHealth({ transport: 4 }, 0)
    const streakedHealth = getWorldHealth({ transport: 4 }, 5)
    expect(streakedHealth).toBeGreaterThan(baseHealth)
  })

  it('getXpForAction is proportional to impact', () => {
    expect(getXpForAction(1)).toBe(30)
    expect(getXpForAction(2)).toBe(50)
  })

  it('getEquivalent returns string for all ranges', () => {
    expect(getEquivalent(0.05)).toContain('soda')
    expect(getEquivalent(0.5)).toContain('text messages')
    expect(getEquivalent(3)).toContain('km')
    expect(getEquivalent(10)).toContain('beef meals')
  })

  it('getCO2Level returns correct bucket', () => {
    expect(getCO2Level(3).label).toBe('Sustainable')
    expect(getCO2Level(6).label).toBe('Moderate')
    expect(getCO2Level(10).label).toBe('High')
    expect(getCO2Level(15).label).toBe('Critical')
  })
})
