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
    <div className="pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-teal-900 px-4 pt-12 pb-5 shadow-md rounded-b-3xl md:rounded-3xl md:mx-4 md:mt-4">
        <h1 className="text-white text-xl font-semibold">Daily Challenges</h1>
        <p className="text-forest-400 text-xs mt-1">Complete actions, reduce emissions, earn XP</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-forest-800 rounded-xl p-3 text-center">
            <div className="text-white text-lg font-semibold">{todayCompleted.length}<span className="text-forest-400 text-xs font-normal">/{actions.length}</span></div>
            <div className="text-forest-400 text-[10px] mt-0.5">Done today</div>
          </div>
          <div className="bg-forest-800 rounded-xl p-3 text-center">
            <div className="text-amber-400 text-lg font-semibold">+{xpToday}</div>
            <div className="text-forest-400 text-[10px] mt-0.5">XP earned</div>
          </div>
          <div className="bg-forest-800 rounded-xl p-3 text-center">
            <div className="text-green-400 text-lg font-semibold">{savedKg.toFixed(1)}</div>
            <div className="text-forest-400 text-[10px] mt-0.5">kg saved</div>
          </div>
        </div>
      </div>

      {/* Nudges */}
      <div className="mx-4 mt-4 bg-white/70 backdrop-blur-md border border-white/50 rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">Today's progress</span>
          <span className="text-xs text-gray-500">{Math.round((todayCompleted.length / actions.length) * 100)}%</span>
        </h2>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-500 rounded-full transition-all duration-700"
            style={{ width: `${(todayCompleted.length / actions.length) * 100}%` }}
          />
        </div>
        {todayCompleted.length === actions.length && (
          <p className="text-xs text-forest-700 font-medium mt-2 text-center">🎉 All done! You're amazing today!</p>
        )}
      </div>

      {/* Easy actions */}
      {easy.length > 0 && (
        <div className="mx-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Easy wins</span>
            <span className="text-[10px] text-gray-400">Quick, low-effort changes</span>
          </div>
          <div className="space-y-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
            {easy.map(action => (
              <ActionCard key={action.id} action={action} onComplete={completeAction} />
            ))}
          </div>
        </div>
      )}

      {/* Medium actions */}
      {medium.length > 0 && (
        <div className="mx-4 mt-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Medium impact</span>
            <span className="text-[10px] text-gray-400">Bigger lifestyle shifts</span>
          </div>
          <div className="space-y-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
            {medium.map(action => (
              <ActionCard key={action.id} action={action} onComplete={completeAction} />
            ))}
          </div>
        </div>
      )}

      {/* Hard actions */}
      {hard.length > 0 && (
        <div className="mx-4 mt-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">High impact</span>
            <span className="text-[10px] text-gray-400">Long-term commitments</span>
          </div>
          <div className="space-y-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
            {hard.map(action => (
              <ActionCard key={action.id} action={action} onComplete={completeAction} />
            ))}
          </div>
        </div>
      )}

      {/* Tip footer */}
      <div className="mx-4 mt-5 bg-sky-50 border border-sky-100 rounded-xl p-3">
        <p className="text-xs text-sky-800 leading-relaxed">
          💡 <strong>Tip:</strong> Start with easy wins to build momentum. Your streak increases when you complete at least one action per day.
        </p>
      </div>
    </div>
  )
}
