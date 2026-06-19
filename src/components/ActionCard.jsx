import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import { getEquivalent } from '../utils/calculations'

const DIFF_COLORS = {
  easy: { bg: '#dcfce7', text: '#166534' },
  medium: { bg: '#fef9c3', text: '#713f12' },
  hard: { bg: '#fee2e2', text: '#7f1d1d' },
}

export default function ActionCard({ action, onComplete }) {
  const [flash, setFlash] = useState(false)

  const handleComplete = () => {
    if (action.completed) return
    setFlash(true)
    
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#16a34a', '#22c55e', '#dcfce7', '#fef9c3', '#fcd34d'],
      disableForReducedMotion: true
    })

    setTimeout(() => {
      setFlash(false)
      onComplete(action.id)
    }, 600)
  }

  const diff = DIFF_COLORS[action.difficulty] || DIFF_COLORS.easy

  return (
    <div
      className={`bg-white border rounded-xl p-3 flex gap-3 items-center transition-all duration-300 ${
        action.completed ? 'opacity-60 border-gray-100' : 'border-gray-100 hover:border-gray-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/5'
      } ${flash ? 'scale-95 bg-green-50' : ''}`}
    >
      <div className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg">
        {action.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${action.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {action.title}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className="text-xs px-1.5 py-0.5 rounded-md font-medium"
            style={{ background: diff.bg, color: diff.text }}
          >
            {action.difficulty}
          </span>
          <span className="text-xs text-green-700 font-medium">−{action.impact} kg CO₂</span>
          <span className="text-xs text-gray-400">{getEquivalent(action.impact)}</span>
        </div>
        <div className="text-xs text-amber-700 font-medium mt-0.5">+{action.xp} XP</div>
      </div>

      <button
        onClick={handleComplete}
        disabled={action.completed}
        aria-label={action.completed ? 'Completed' : `Mark "${action.title}" as done`}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          action.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-green-400 text-green-500 hover:bg-green-50 active:scale-90'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
