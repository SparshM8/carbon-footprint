import React, { useState } from 'react'
import PropTypes from 'prop-types'
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
      colors: ['#005a3c', '#22c55e', '#c9f34a', '#ffb25f'],
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
      className={`rounded-2xl border p-4 flex gap-3.5 items-center transition-all duration-300 ${
        action.completed
          ? 'opacity-60 border-[#ede9dc] bg-[#faf8f4]'
          : 'border-[#ede9dc] bg-[#fffdf8] hover:border-[#ded8c9] hover:-translate-y-0.5 hover:shadow-md'
      } ${flash ? 'scale-95 bg-[#eafbba]/30' : ''}`}
    >
      <div className="text-2xl flex-shrink-0 w-11 h-11 flex items-center justify-center bg-[#f4efe4] rounded-xl text-[#005a3c]">
        {action.icon || '🌱'}
      </div>

      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold truncate ${action.completed ? 'line-through text-gray-400' : 'text-[#062b20]'}`}>
          {action.title}
        </div>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize"
            style={{ background: diff.bg, color: diff.text }}
          >
            {action.difficulty}
          </span>
          <span className="text-xs text-[#005a3c] font-bold">−{action.impact} kg CO₂</span>
          {action.moneySaved > 0 && (
            <span className="text-[10px] bg-[#eafbba] text-[#4d7c0f] px-2 py-0.5 rounded-full font-bold">
              💰 Saves ₹{action.moneySaved}
            </span>
          )}
        </div>

        <div className="text-[11px] text-[#b45309] font-medium mt-1">+{action.xp} XP reward</div>
      </div>

      <button
        onClick={handleComplete}
        disabled={action.completed}
        aria-label={action.completed ? 'Completed' : `Mark "${action.title}" as done`}
        className={`size-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          action.completed
            ? 'bg-[#005a3c] border-[#005a3c] text-white shadow-xs'
            : 'border-[#005a3c]/40 text-[#005a3c] hover:bg-[#d5f3df] active:scale-90'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

ActionCard.propTypes = {
  action: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    impact: PropTypes.number.isRequired,
    moneySaved: PropTypes.number,
    difficulty: PropTypes.string.isRequired,
    xp: PropTypes.number.isRequired,
    completed: PropTypes.bool
  }).isRequired,
  onComplete: PropTypes.func.isRequired
}
