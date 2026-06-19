import React from 'react'
import useStore from '../store/useStore'
import WorldScene from '../components/WorldScene'
import { getWorldHealth, getTotalKg } from '../utils/calculations'

export default function WorldView() {
  const { footprint, user, achievements } = useStore()
  const health = getWorldHealth(footprint, user.streak)
  const total = getTotalKg(footprint)

  const healthLabel = health >= 75 ? { label: 'Thriving', color: '#16a34a', icon: '🌿' }
    : health >= 50 ? { label: 'Recovering', color: '#d97706', icon: '🌱' }
    : health >= 25 ? { label: 'Stressed', color: '#ea580c', icon: '🍂' }
    : { label: 'Critical', color: '#dc2626', icon: '🥀' }

  const worldEvents = [
    health > 60 && {
      icon: '🌳', color: '#16a34a',
      title: `${Math.max(1, Math.floor(user.streak / 2))} new trees sprouted`,
      msg: 'Your consistent actions this week grew the forest. Keep going!'
    },
    health > 50 && {
      icon: '☀️', color: '#d97706',
      title: 'Sky is clearing',
      msg: `Transport choices reduced air haze. ${(100 - health)}% smog remaining.`
    },
    total > 8 && {
      icon: '🌊', color: '#ef4444',
      title: 'River level dropping',
      msg: 'Shopping emissions are straining the ecosystem. Try one second-hand purchase.'
    },
    health <= 50 && {
      icon: '🍂', color: '#ea580c',
      title: 'Forest thinning',
      msg: 'High emissions are affecting tree growth. Complete 2 actions today to reverse this.'
    },
    user.streak >= 7 && {
      icon: '🔥', color: '#f59e0b',
      title: `${user.streak}-day streak bonus!`,
      msg: 'Your consistency adds +14% to ecosystem health. Incredible work!'
    },
  ].filter(Boolean).slice(0, 3)

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-teal-900 px-4 pt-12 pb-4 shadow-md rounded-b-3xl md:rounded-3xl md:mx-4 md:mt-4">
        <h1 className="text-white text-xl font-semibold">Your Living World</h1>
        <p className="text-forest-400 text-xs mt-1">Every choice shapes this ecosystem</p>
      </div>

      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:px-4 md:mt-4">
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Main world container */}
          <div className="mx-4 md:mx-0 bg-white/70 backdrop-blur-md border border-white/50 rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <WorldScene footprint={footprint} streak={user.streak} />
            <div className="flex items-center justify-between mt-4">
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Ecosystem status</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{healthLabel.icon}</span>
                  <span className="text-base font-semibold" style={{ color: healthLabel.color }}>{healthLabel.label}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: healthLabel.color }}>{health}%</div>
                <div className="text-xs text-gray-400">health score</div>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${health}%`, background: healthLabel.color }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Reduce your footprint below 4 kg/day consistently to reach a <strong>thriving ecosystem</strong>.
            </p>
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col gap-4 mt-4 md:mt-0">
          {/* World events */}
          {worldEvents.length > 0 && (
            <div className="mx-4 md:mx-0">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">World events this week</h2>
              <div className="space-y-2">
                {worldEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white/70 backdrop-blur-md border border-white/50 rounded-xl p-3 flex gap-3 items-start shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-all"
                    style={{ borderLeftWidth: 3, borderLeftColor: event.color }}
                  >
                    <span className="text-xl flex-shrink-0">{event.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{event.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          <div className="mx-4 md:mx-0">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Achievements</h2>
            <div className="grid grid-cols-3 gap-2">
              {achievements.map(a => (
                <div
                  key={a.id}
                  className={`bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl p-3 text-center transition-all hover:-translate-y-1 ${
                    a.earned ? '' : 'opacity-50 grayscale'
                  }`}
                >
                  <div className="text-2xl mb-1">{a.icon}</div>
                  <div className="text-[11px] font-medium text-gray-800 leading-tight">{a.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{a.desc}</div>
                  {a.earned && a.date && (
                    <div className="text-[9px] text-amber-600 mt-1 font-medium">Earned ✓</div>
                  )}
                  {!a.earned && (
                    <div className="text-[9px] text-gray-400 mt-1">Locked 🔒</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
