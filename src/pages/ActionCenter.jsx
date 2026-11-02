import React, { useMemo } from 'react'
import useStore from '../store/useStore'
import ActionCard from '../components/ActionCard'
import { getTotalKg } from '../utils/calculations'

export default function ActionCenter() {
  const { actions, completedActions, user, footprint, completeAction } = useStore()
  const total = getTotalKg(footprint)

  const todayCompleted = useMemo(() => {
    const today = new Date().toDateString()
    return completedActions.filter(a => new Date(a.completedAt).toDateString() === today)
  }, [completedActions])

  const xpToday = todayCompleted.reduce((sum, a) => sum + (a.xp || 0), 0)
  const savedKg = todayCompleted.reduce((sum, a) => sum + (a.impact || 0), 0)

  const easy = actions.filter(a => a.difficulty === 'easy')
  const medium = actions.filter(a => a.difficulty === 'medium')
  const hard = actions.filter(a => a.difficulty === 'hard')

  return (
    <div className="min-h-screen pb-12">
      {/* Header matching Carbonly theme */}
      <header className="flex flex-col gap-3 pt-4 md:pt-8 mb-6">
        <p className="flex items-center gap-2 text-sm font-medium text-[#005a3c]">
          <span className="size-2 rounded-full bg-[#005a3c]" /> Daily impact challenges
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[#062b20] md:text-5xl">
          Take action, earn <em className="font-serif text-[#005a3c]">progress.</em>
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-[#6f7f78] md:text-base">
          Complete targeted lifestyle challenges to shrink your daily carbon emissions, level up your profile, and watch your ecosystem bloom.
        </p>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-3 mt-4 max-w-2xl">
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-[#062b20]">
              {todayCompleted.length}
              <span className="text-[#89958f] text-xs font-normal">/{actions.length}</span>
            </div>
            <div className="text-[#718079] text-xs mt-0.5">Completed today</div>
          </div>
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-[#b45309]">+{xpToday}</div>
            <div className="text-[#718079] text-xs mt-0.5">XP gained</div>
          </div>
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-[#005a3c]">{savedKg.toFixed(1)}</div>
            <div className="text-[#718079] text-xs mt-0.5">kg CO₂ saved</div>
          </div>
        </div>
      </header>

      {/* Progress Card */}
      <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-[#062b20]">Today&apos;s Goal Progress</h2>
          <span className="text-xs font-semibold text-[#005a3c]">
            {Math.round((todayCompleted.length / actions.length) * 100)}% Complete
          </span>
        </div>
        <div className="h-2.5 bg-[#ede8dc] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#005a3c] rounded-full transition-all duration-700"
            style={{ width: `${(todayCompleted.length / actions.length) * 100}%` }}
          />
        </div>
        {todayCompleted.length === actions.length && (
          <p className="text-xs text-[#005a3c] font-medium mt-2 text-center">
            🎉 All daily actions complete! Your ecosystem is thriving today!
          </p>
        )}
      </div>

      {/* Easy actions */}
      {easy.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#062b20] uppercase tracking-wider">Quick Wins</span>
            <span className="text-[11px] text-[#718079]">· Low effort, immediate impact</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {easy.map(action => (
              <ActionCard key={action.id} action={action} onComplete={completeAction} />
            ))}
          </div>
        </div>
      )}

      {/* Medium actions */}
      {medium.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#062b20] uppercase tracking-wider">Medium Impact</span>
            <span className="text-[11px] text-[#718079]">· Lifestyle shifts & habits</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {medium.map(action => (
              <ActionCard key={action.id} action={action} onComplete={completeAction} />
            ))}
          </div>
        </div>
      )}

      {/* Hard actions */}
      {hard.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#062b20] uppercase tracking-wider">High Impact</span>
            <span className="text-[11px] text-[#718079]">· Transformative long-term choices</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {hard.map(action => (
              <ActionCard key={action.id} action={action} onComplete={completeAction} />
            ))}
          </div>
        </div>
      )}

      {/* Tip footer */}
      <div className="rounded-2xl border border-[#d5f3df] bg-[#f0f9f3] p-4 text-xs text-[#1e503b] leading-relaxed flex items-center gap-3">
        <span className="text-xl">💡</span>
        <span>
          <strong>Pro-Tip:</strong> Complete at least one challenge every day to preserve your streak bonus and maintain 100% ecosystem health in the Insights view.
        </span>
      </div>
    </div>
  )
}
