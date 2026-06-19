import { evaluateNudges } from '../utils/nudgeTriggers'

describe('nudgeTriggers utility', () => {
  const footprint = { transport: 5, food: 4, energy: 1 }

  it('transport nudge fires between 7-9am', () => {
    const date = new Date()
    date.setHours(8)
    const nudges = evaluateNudges(footprint, [], date)
    expect(nudges.some(n => n.type === 'transport')).toBe(true)
  })

  it('food nudge fires at 11am-noon', () => {
    const date = new Date()
    date.setHours(11, 30)
    const nudges = evaluateNudges(footprint, [], date)
    expect(nudges.some(n => n.type === 'food')).toBe(true)
  })

  it('no nudge fires when footprint is low', () => {
    const date = new Date()
    date.setHours(8)
    const lowFootprint = { transport: 1, food: 1, energy: 1 }
    const nudges = evaluateNudges(lowFootprint, [], date)
    expect(nudges.some(n => n.type === 'transport')).toBe(false)
  })

  it('dismissed nudge does not re-appear', () => {
    const date = new Date()
    date.setHours(8)
    const dismissedNudges = [{ id: 'transport_morning', dismissed: true }]
    const nudges = evaluateNudges(footprint, dismissedNudges, date)
    expect(nudges.some(n => n.type === 'transport')).toBe(false)
  })
})
