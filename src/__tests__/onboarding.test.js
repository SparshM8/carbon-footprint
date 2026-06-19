/**
 * @fileoverview Tests for the Zustand store's onboarding completion flow.
 * These tests are isolated to verify that user-supplied onboarding data
 * correctly migrates into the store and unlocks the main application.
 */
import useStore from '../store/useStore'

describe('Onboarding store flow', () => {
  beforeEach(() => {
    useStore.setState({
      onboardingComplete: false,
      user: { name: '', xp: 0, streak: 0 },
      footprint: { transport: 0, food: 0, energy: 0, shopping: 0, digital: 0 },
    })
  })

  it('sets onboardingComplete to true on completeOnboarding', () => {
    useStore.getState().completeOnboarding({ name: 'Sparsh', avatar: '🌿' })
    expect(useStore.getState().onboardingComplete).toBe(true)
  })

  it('saves user name from onboarding data', () => {
    useStore.getState().completeOnboarding({ name: 'Sparsh', avatar: '🌿' })
    expect(useStore.getState().user.name).toBe('Sparsh')
  })

  it('saves user avatar from onboarding data', () => {
    useStore.getState().completeOnboarding({ name: 'Sparsh', avatar: '🌿' })
    expect(useStore.getState().user.avatar).toBe('🌿')
  })

  it('saves custom footprint from onboarding data', () => {
    const customFootprint = { transport: 4, food: 3, energy: 2, shopping: 1, digital: 0.5 }
    useStore.getState().completeOnboarding({ name: 'Sparsh', footprint: customFootprint })
    expect(useStore.getState().footprint.transport).toBe(4)
  })

  it('keeps existing footprint if none provided in onboarding', () => {
    useStore.setState({ footprint: { transport: 5, food: 5, energy: 2 } })
    useStore.getState().completeOnboarding({ name: 'Sparsh' })
    expect(useStore.getState().footprint.transport).toBe(5)
  })
})
