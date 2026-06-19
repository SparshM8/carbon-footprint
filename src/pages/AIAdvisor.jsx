import React, { useState, useRef, useEffect } from 'react'
import useStore from '../store/useStore'
import { callEcoAI } from '../utils/aiAdvisor'
import { getTotalKg } from '../utils/calculations'

const QUICK_PROMPTS = [
  'How does my footprint compare to India average?',
  'Give me a personalised 7-day reduction plan',
  'What does my biggest emission mean in real life?',
  'Which single change would help me the most?',
]

const WELCOME_MSG = {
  id: 'welcome',
  role: 'assistant',
  content: null, // rendered dynamically
  ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}

export default function AIAdvisor() {
  const { footprint, completedActions, user, chatMessages, addChatMessage } = useStore()
  const total = getTotalKg(footprint)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const hasApiKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY

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
      const reply = await callEcoAI(history, footprint, completedActions, user.streak)
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

  const biggest = Object.entries(footprint).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-4rem)] pb-16 md:pb-0 md:bg-white/50 md:backdrop-blur-md md:rounded-2xl md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border md:border-white/50 md:mt-2 md:mx-4 lg:mx-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-teal-900 px-4 py-4 flex-shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-forest-700 border-2 border-forest-500 flex items-center justify-center text-xl">
            🌿
          </div>
          <div>
            <h1 className="text-white text-base font-semibold">EcoAI Advisor</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-forest-400 text-[10px]">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Context bar */}
      <div className="bg-forest-950 px-4 py-2 flex items-center gap-3 flex-shrink-0">
        <div className="text-[10px] text-forest-400">Your context:</div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-[10px] bg-forest-800 text-forest-300 px-2 py-0.5 rounded-full">
            {total} kg CO₂ today
          </span>
          <span className="text-[10px] bg-forest-800 text-forest-300 px-2 py-0.5 rounded-full">
            Biggest: {biggest[0]} ({biggest[1]} kg)
          </span>
          <span className="text-[10px] bg-forest-800 text-forest-300 px-2 py-0.5 rounded-full">
            🔥 {user.streak}-day streak
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 md:bg-transparent">
        {/* Welcome bubble */}
        <div className="max-w-[82%]">
          <div className="bg-white/80 backdrop-blur-md border border-white/50 md:border-white/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <p className="text-sm text-gray-800 leading-relaxed">
              Hi <strong>{user.name}</strong>! 👋 I'm EcoAI, your personal carbon advisor.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-1.5">
              Your footprint today is <strong className="text-forest-700">{total} kg CO₂</strong>
              {total < 11.5 ? ' — already below the global average! 🌱' : '. Let\'s work on bringing it down together.'}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-1.5">
              Your top emission source is <strong>{biggest[0]}</strong> at {biggest[1]} kg — that's where we have the most to gain. Ask me anything!
            </p>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 ml-1">EcoAI · just now</p>
        </div>

        {/* Chat history */}
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[82%] ${msg.role === 'user' ? '' : ''}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-[0_4px_20px_rgb(0,0,0,0.03)] ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-forest-600 to-forest-500 text-white rounded-tr-sm'
                  : 'bg-white/80 backdrop-blur-md border border-white/50 text-gray-800 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              <p className={`text-[10px] text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                {msg.role === 'user' ? 'You' : 'EcoAI'} · {msg.ts}
              </p>
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* No API key notice */}
        {!hasApiKey && chatMessages.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
            <p className="text-xs text-amber-800 font-medium mb-1">⚠️ API key not configured</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Add <code className="bg-amber-100 px-1 rounded">VITE_ANTHROPIC_API_KEY</code> to your <code className="bg-amber-100 px-1 rounded">.env</code> file to enable AI responses.
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {chatMessages.length === 0 && (
        <div className="px-4 pb-3 flex-shrink-0 bg-transparent">
          <p className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wide">Suggested questions</p>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-2">
            {QUICK_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => send(p)}
                disabled={loading}
                className="text-left text-xs text-gray-700 bg-white/70 backdrop-blur-md border border-white/50 hover:border-forest-300 hover:bg-white/90 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all active:scale-98"
              >
                {p} ↗
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-3 border-t border-white/50 bg-white/50 backdrop-blur-lg flex-shrink-0 md:rounded-b-2xl md:pb-6">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask EcoAI anything..."
            rows={1}
            disabled={loading}
            aria-label="Message EcoAI"
            className="flex-1 resize-none px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent transition-all disabled:opacity-50"
            style={{ maxHeight: 96, overflowY: 'auto' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="w-10 h-10 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:bg-gray-200 text-white flex items-center justify-center transition-all active:scale-90 flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M14 2L2 7l5 1 1 5 6-11z" fill="currentColor" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
