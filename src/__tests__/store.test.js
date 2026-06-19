/**
 * @fileoverview Comprehensive tests for the Zustand application state store.
 * Tests cover action completion, XP rewards, footprint updates, nudge
 * dismissal, and state integrity across sequential operations.
 */
import useStore from '../store/useStore'

describe('Zustand store', () => {
  /** Reset to a clean, known state before each test */
  beforeEach(() => {
    useStore.setState({
      user: { xp: 100, streak: 3, level: 1 },
      footprint: { transport: 5, food: 5, energy: 2, shopping: 1, digital: 0.3 },
      actions: [
        { id: 'act1', category: 'transport', impact: 2, xp: 50, title: 'Take the bus', completed: false },
        { id: 'act2', category: 'food', impact: 1.5, xp: 40, title: 'Eat plant-based', completed: false },
      ],
      completedActions: [],
      nudges: [
        { id: 'n1', type: 'transport', dismissed: false },
        { id: 'n2', type: 'food', dismissed: false },
      ],
      chatMessages: [],
    })
  })

  // ─── completeAction ───────────────────────────────────────────────────────

  describe('completeAction', () => {
    it('reduces footprint for the affected category', () => {
      useStore.getState().completeAction('act1')
      const { footprint } = useStore.getState()
      expect(footprint.transport).toBeLessThan(5)
    })

    it('awards XP to the user', () => {
      useStore.getState().completeAction('act1')
      expect(useStore.getState().user.xp).toBe(150)
    })

    it('marks action as completed', () => {
      useStore.getState().completeAction('act1')
      const action = useStore.getState().actions.find(a => a.id === 'act1')
      expect(action.completed).toBe(true)
    })

    it('adds the action to completedActions list', () => {
      useStore.getState().completeAction('act1')
      expect(useStore.getState().completedActions).toHaveLength(1)
    })

    it('does nothing for a non-existent action ID', () => {
      const before = useStore.getState().user.xp
      useStore.getState().completeAction('nonexistent')
      expect(useStore.getState().user.xp).toBe(before)
    })

    it('correctly computes footprint reduction: transport - 2*0.1 = 4.8', () => {
      useStore.getState().completeAction('act1')
      expect(useStore.getState().footprint.transport).toBe(4.8)
    })

    it('does not affect other footprint categories', () => {
      const foodBefore = useStore.getState().footprint.food
      useStore.getState().completeAction('act1')
      expect(useStore.getState().footprint.food).toBe(foodBefore)
    })
  })

  // ─── dismissNudge ─────────────────────────────────────────────────────────

  describe('dismissNudge', () => {
    it('sets dismissed=true for the target nudge', () => {
      useStore.getState().dismissNudge('n1')
      expect(useStore.getState().nudges[0].dismissed).toBe(true)
    })

    it('does not affect other nudges', () => {
      useStore.getState().dismissNudge('n1')
      expect(useStore.getState().nudges[1].dismissed).toBe(false)
    })

    it('all nudges can be dismissed independently', () => {
      useStore.getState().dismissNudge('n1')
      useStore.getState().dismissNudge('n2')
      const { nudges } = useStore.getState()
      expect(nudges.every(n => n.dismissed)).toBe(true)
    })
  })

  // ─── updateFootprint ──────────────────────────────────────────────────────

  describe('updateFootprint', () => {
    it('updates a specific category value', () => {
      useStore.getState().updateFootprint('energy', 3.5)
      expect(useStore.getState().footprint.energy).toBe(3.5)
    })

    it('does not affect other categories', () => {
      const transportBefore = useStore.getState().footprint.transport
      useStore.getState().updateFootprint('energy', 3.5)
      expect(useStore.getState().footprint.transport).toBe(transportBefore)
    })
  })

  // ─── addChatMessage ───────────────────────────────────────────────────────

  describe('addChatMessage', () => {
    it('appends a message to chatMessages', () => {
      useStore.getState().addChatMessage({ role: 'user', content: 'Hello!' })
      expect(useStore.getState().chatMessages).toHaveLength(1)
    })

    it('preserves message order', () => {
      useStore.getState().addChatMessage({ role: 'user', content: 'First' })
      useStore.getState().addChatMessage({ role: 'assistant', content: 'Second' })
      const { chatMessages } = useStore.getState()
      expect(chatMessages[0].content).toBe('First')
      expect(chatMessages[1].content).toBe('Second')
    })
  })

  // ─── setPage ──────────────────────────────────────────────────────────────

  describe('setPage', () => {
    it('updates the currentPage state', () => {
      useStore.getState().setPage('actions')
      expect(useStore.getState().currentPage).toBe('actions')
    })
  })
})
