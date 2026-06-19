import useStore from '../store/useStore'

describe('Zustand store', () => {
  beforeEach(() => {
    useStore.setState({
      user: { xp: 100, streak: 1 },
      footprint: { transport: 5, food: 5 },
      actions: [
        { id: 'act1', category: 'transport', impact: 2, xp: 50, completed: false }
      ],
      completedActions: [],
      nudges: [
        { id: 'n1', dismissed: false }
      ]
    })
  })

  it('completeAction updates footprint', () => {
    useStore.getState().completeAction('act1')
    const state = useStore.getState()
    expect(state.footprint.transport).toBe(4.8)
  })

  it('completeAction adds XP', () => {
    useStore.getState().completeAction('act1')
    const state = useStore.getState()
    expect(state.user.xp).toBe(150)
  })

  it('dismissNudge sets dismissed=true', () => {
    useStore.getState().dismissNudge('n1')
    const state = useStore.getState()
    expect(state.nudges[0].dismissed).toBe(true)
  })
})
