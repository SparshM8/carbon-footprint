import React, { useState, useRef, useEffect } from 'react'
import useStore from '../store/useStore'
import { callEcoAI } from '../utils/aiAdvisor'
import { getTotalKg } from '../utils/calculations'
import { Send, Sparkles } from 'lucide-react'

const QUICK_PROMPTS = [
  'How does my footprint compare to India average?',
  'Give me a personalised 7-day reduction plan',
  'What does my biggest emission mean in real life?',
  'Which single change would help me the most?',
]

export default function AIAdvisor() {
  const { footprint, completedActions, user, chatMessages, addChatMessage } = useStore()
  const total = getTotalKg(footprint)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, loading])

  const send = async (text) => {
    const msg = text.trim()
    if (!msg || loading) return
    setInput('')
    setError('')

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    addChatMessage(userMsg)
    setLoading(true)

    try {
      const history = [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content }))
      const reply = await callEcoAI(history, footprint, completedActions, user?.streak || 0, { allowFallback: true })
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const biggest = Object.entries(footprint).sort((a, b) => b[1] - a[1])[0] || ['transport', 0]

  return (
    <div className="min-h-screen pb-12">
      {/* Header matching Carbonly theme */}
      <header className="flex flex-col gap-3 pt-4 md:pt-8 mb-6">
        <p className="flex items-center gap-2 text-sm font-medium text-[#005a3c]">
          <span className="size-2 rounded-full bg-[#005a3c]" /> Intelligent Carbon Guidance
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[#062b20] md:text-5xl">
          EcoAI Advisor <em className="font-serif text-[#005a3c]">by Gemini Flash.</em>
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-[#6f7f78] md:text-base">
          Get real-time, personalized recommendations tailored to your daily footprint. Ask anything about sustainable habits, benchmarks, or actionable climate swaps.
        </p>
      </header>

      {/* Main Chat Container */}
      <div className="flex flex-col h-[640px] rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] shadow-sm overflow-hidden">
        {/* Chat Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0ece1] bg-[#faf8f2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#d5f3df] text-[#005a3c] flex items-center justify-center text-lg font-bold shadow-xs">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-[#062b20]">EcoAI Chat</h2>
                <span className="text-[10px] bg-[#d5f3df] text-[#005a3c] font-semibold px-2 py-0.5 rounded-full">
                  Gemini Flash 3.8
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[#718079] text-[10px]">
                  {hasApiKey ? 'Connected to Google Gemini API' : 'Gemini Simulation Engine Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Context Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] bg-[#f0ece1] text-[#4d5e56] px-2.5 py-1 rounded-full font-medium">
              {total} kg CO₂ today
            </span>
            <span className="text-[11px] bg-[#f0ece1] text-[#4d5e56] px-2.5 py-1 rounded-full font-medium">
              Top: {biggest[0]} ({biggest[1]} kg)
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fbf9f4]/50">
          {/* Welcome Bubble */}
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-xs border border-[#e8e4d8] bg-white p-4 shadow-xs">
              <p className="text-xs text-[#062b20] font-semibold mb-1">
                EcoAI (Gemini Flash 3.8)
              </p>
              <p className="text-sm text-[#243a32] leading-relaxed">
                Hi <strong>{user?.name || 'there'}</strong>! ✨ I&apos;m your personal carbon advisor.
              </p>
              <p className="text-sm text-[#52645a] leading-relaxed mt-2">
                Your footprint today is <strong className="text-[#005a3c] font-semibold">{total} kg CO₂</strong>. Your primary impact area is <strong>{biggest[0]}</strong> at {biggest[1]} kg.
              </p>
              <p className="text-sm text-[#52645a] leading-relaxed mt-2">
                Feel free to ask me anything or click one of the suggested prompts below to explore where you have the highest leverage!
              </p>
            </div>
          </div>

          {/* Chat History */}
          {chatMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[85%]">
                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed shadow-xs whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'rounded-tr-xs bg-[#005a3c] text-white'
                      : 'rounded-tl-xs border border-[#e8e4d8] bg-white text-[#243a32]'
                  }`}
                >
                  {msg.content}
                </div>
                <p className={`text-[10px] text-[#89958f] mt-1 ${msg.role === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                  {msg.role === 'user' ? 'You' : 'EcoAI'} · {msg.ts}
                </p>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-xs border border-[#e8e4d8] bg-white px-4 py-3 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#005a3c] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="size-2 rounded-full bg-[#005a3c] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="size-2 rounded-full bg-[#005a3c] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts (visible if no user messages yet) */}
        {chatMessages.length === 0 && (
          <div className="px-5 py-3 border-t border-[#f0ece1] bg-[#faf8f2]">
            <p className="text-[10px] font-semibold text-[#718079] uppercase tracking-wider mb-2">
              Suggested topics
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  disabled={loading}
                  className="rounded-full border border-[#ded8c9] bg-white px-3 py-1.5 text-xs text-[#243a32] transition hover:border-[#005a3c] hover:bg-[#f4efe4] active:scale-95 text-left"
                >
                  {p} ↗
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input Bar */}
        <div className="p-4 border-t border-[#f0ece1] bg-white">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask EcoAI anything about your carbon footprint..."
              disabled={loading}
              className="flex-1 rounded-xl border border-[#ded8c9] bg-[#fbf9f4] px-4 py-3 text-sm text-[#062b20] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#005a3c] focus:border-[#005a3c]"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              aria-label="Send message to EcoAI"
              className="grid size-11 place-items-center rounded-xl bg-[#005a3c] text-white transition hover:bg-[#00452f] disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 shadow-xs"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
