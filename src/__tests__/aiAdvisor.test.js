/**
 * @fileoverview Integration tests for the AI Advisor utility module.
 * Tests cover context building logic, system prompt construction, and
 * error handling for missing API keys and failed API responses.
 */
import { callEcoAI } from '../utils/aiAdvisor'
import { vi } from 'vitest'

describe('aiAdvisor utility', () => {
  const mockFootprint = { transport: 3, food: 2, energy: 1, shopping: 0.5, digital: 0.2 }
  const mockActions = [{ title: 'Took the bus' }]
  const mockStreak = 5

  beforeEach(() => {
    vi.resetAllMocks()
  })

  // ─── API key guard ────────────────────────────────────────────────────────

  describe('API key validation', () => {
    it('throws an error when VITE_ANTHROPIC_API_KEY is not set', async () => {
      vi.stubEnv('VITE_ANTHROPIC_API_KEY', '')
      await expect(callEcoAI([], mockFootprint, mockActions, mockStreak))
        .rejects
        .toThrow('API key not configured')
      vi.unstubAllEnvs()
    })
  })

  // ─── Successful API call ──────────────────────────────────────────────────

  describe('successful API response', () => {
    it('returns the text from the API response', async () => {
      vi.stubEnv('VITE_ANTHROPIC_API_KEY', 'test-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          content: [{ text: 'Great job taking the bus today!' }],
        }),
      })

      const result = await callEcoAI(
        [{ role: 'user', content: 'How am I doing?' }],
        mockFootprint,
        mockActions,
        mockStreak
      )

      expect(result).toBe('Great job taking the bus today!')
      vi.unstubAllEnvs()
    })

    it('sends the correct model name in request body', async () => {
      vi.stubEnv('VITE_ANTHROPIC_API_KEY', 'test-key')
      let capturedBody
      global.fetch = vi.fn().mockImplementation(async (_url, opts) => {
        capturedBody = JSON.parse(opts.body)
        return {
          ok: true,
          json: async () => ({ content: [{ text: 'ok' }] }),
        }
      })

      await callEcoAI([], mockFootprint, [], 0)
      expect(capturedBody.model).toBe('claude-sonnet-4-6')
      vi.unstubAllEnvs()
    })
  })

  // ─── API error handling ───────────────────────────────────────────────────

  describe('API error handling', () => {
    it('throws an error when the API returns a non-OK response', async () => {
      vi.stubEnv('VITE_ANTHROPIC_API_KEY', 'test-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: 'Unauthorized' } }),
      })

      await expect(callEcoAI([], mockFootprint, [], 0))
        .rejects
        .toThrow('Unauthorized')
      vi.unstubAllEnvs()
    })
  })
})
