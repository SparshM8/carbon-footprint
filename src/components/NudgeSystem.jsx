import React, { useState, useEffect } from 'react'
import useStore from '../store/useStore'
import { evaluateNudges } from '../utils/nudgeTriggers'

const URGENCY_COLORS = {
  high: { border: '#ef4444', bg: '#fef2f2', icon_bg: '#fee2e2' },
  medium: { border: '#f59e0b', bg: '#fffbeb', icon_bg: '#fef3c7' },
  low: { border: '#22c55e', bg: '#f0fdf4', icon_bg: '#dcfce7' },
}

export default function NudgeSystem() {
  const { footprint, completedActions, nudges, dismissNudge } = useStore()
  const [dynamicNudges, setDynamicNudges] = useState([])

  useEffect(() => {
    const computed = evaluateNudges(footprint, completedActions)
    setDynamicNudges(computed)
  }, [footprint, completedActions])

  const allNudges = [
    ...dynamicNudges,
    ...nudges.filter(n => !n.dismissed),
  ].slice(0, 2)

  if (allNudges.length === 0) return null

  return (
    <div className="px-4 pt-3 space-y-2">
      {allNudges.map(nudge => {
        const colors = URGENCY_COLORS[nudge.urgency] || URGENCY_COLORS.medium
        return (
          <div
            key={nudge.id}
            role="alert"
            className="flex gap-3 p-3 rounded-xl border-l-4"
            style={{
              background: colors.bg,
              borderLeftColor: colors.border,
              borderTop: '0.5px solid rgba(0,0,0,0.06)',
              borderRight: '0.5px solid rgba(0,0,0,0.06)',
              borderBottom: '0.5px solid rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: colors.icon_bg }}
              aria-hidden="true"
            >
              {nudge.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{nudge.title}</div>
              <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">{nudge.message}</div>
            </div>
            <button
              onClick={() => dismissNudge(nudge.id)}
              aria-label="Dismiss nudge"
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 self-start mt-0.5"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
