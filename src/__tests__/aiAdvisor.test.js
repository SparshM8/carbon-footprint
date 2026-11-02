/**
 * @fileoverview Integration tests for the Gemini Flash AI Advisor utility module.
 * Tests cover context building logic, Gemini payload structure, and
 * error handling for missing API keys, simulated fallback, and API responses.
 */
import { callEcoAI, buildContext, generateOfflineGeminiResponse } from '../utils/aiAdvisor'
import { vi } from 'vitest'

describe('aiAdvisor utility (Gemini Flash)', () => {
  const mockFootprint = { transport: 3, food: 2, energy: 1, shopping: 0.5, digital: 0.2 }
  const mockActions = [{ title: 'Took the bus' }]
  const mockStreak = 5

  beforeEach(() => {
    vi.resetAllMocks()
  })

  // ─── API key guard ────────────────────────────────────────────────────────

  describe('API key validation & fallback', () => {
    it('throws an error when VITE_GEMINI_API_KEY is not set and fallback is false', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', '')
      await expect(callEcoAI([], mockFootprint, mockActions, mockStreak, { allowFallback: false }))
        .rejects
        .toThrow('API key not configured')
      vi.unstubAllEnvs()
    })

    it('returns a simulated Gemini reply when allowFallback is true without API key', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', '')
      const result = await callEcoAI(
        [{ role: 'user', content: 'Give me a 7-day plan' }],
        mockFootprint,
        mockActions,
        mockStreak,
        { allowFallback: true }
      )
      expect(result).toContain('Gemini Reduction Plan')
      vi.unstubAllEnvs()
    })
  })

  // ─── Context building ─────────────────────────────────────────────────────

  describe('buildContext', () => {
    it('formats footprint and streak correctly', () => {
      const context = buildContext(mockFootprint, mockActions, mockStreak)
      expect(context).toContain('6.7 kg CO₂')
      expect(context).toContain('transport (3 kg)')
      expect(context).toContain('Took the bus')
      expect(context).toContain('5 days')
    })
  })

  // ─── Successful Gemini API call ───────────────────────────────────────────

  describe('successful Gemini API response', () => {
    it('returns candidate text from Gemini generateContent response', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-gemini-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Great job taking the bus today!' }],
                role: 'model',
              },
            },
          ],
        }),
      })

      const result = await callEcoAI(
        [{ role: 'user', content: 'How am I doing?' }],
        mockFootprint,
        mockActions,
        mockStreak
      )

      expect(result).toBe('Great job taking the bus today!')
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.objectContaining({
          method: 'POST',
        })
      )
      vi.unstubAllEnvs()
    })

    it('sends the correct system instruction and contents format', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-gemini-key')
      let capturedBody
      global.fetch = vi.fn().mockImplementation(async (_url, opts) => {
        capturedBody = JSON.parse(opts.body)
        return {
          ok: true,
          json: async () => ({
            candidates: [
              { content: { parts: [{ text: 'ok' }], role: 'model' } },
            ],
          }),
        }
      })

      await callEcoAI([{ role: 'user', content: 'hello' }], mockFootprint, [], 0)
      expect(capturedBody.systemInstruction).toBeDefined()
      expect(capturedBody.contents[0].parts[0].text).toBe('hello')
      vi.unstubAllEnvs()
    })
  })

  // ─── API error handling ───────────────────────────────────────────────────

  describe('API error handling', () => {
    it('throws an error when Gemini returns a non-OK response', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-gemini-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ error: { message: 'The provided API key is invalid' } }),
      })

      await expect(callEcoAI([], mockFootprint, [], 0))
        .rejects
        .toThrow('The provided API key is invalid')
      vi.unstubAllEnvs()
    })
  })

  // ─── Offline Gemini Simulation ────────────────────────────────────────────

  describe('generateOfflineGeminiResponse', () => {
    it('answers comparison questions with India benchmark', () => {
      const response = generateOfflineGeminiResponse('How do I compare to India average?', mockFootprint, [], 3)
      expect(response).toContain('Indian average')
    })

    it('answers biggest lever questions', () => {
      const response = generateOfflineGeminiResponse('What is my biggest single change?', mockFootprint, [], 3)
      expect(response.toLowerCase()).toContain('transport')
    })
  })
})
