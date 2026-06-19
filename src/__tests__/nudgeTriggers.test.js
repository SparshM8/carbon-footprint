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

  it('low footprint gets medium urgency morning nudge', () => {
    const date = new Date()
    date.setHours(8)
    const lowFootprint = { transport: 1, food: 1, energy: 1 }
    const nudges = evaluateNudges(lowFootprint, [], date)
    const transportNudge = nudges.find(n => n.id === 'transport-morning')
    expect(transportNudge.urgency).toBe('medium')
  })

  it('completed action does not trigger morning nudge', () => {
    const date = new Date()
    date.setHours(8)
    const completedActions = [{ category: 'transport' }]
    const nudges = evaluateNudges(footprint, completedActions, date)
    expect(nudges.some(n => n.id === 'transport-morning')).toBe(false)
  })
})
