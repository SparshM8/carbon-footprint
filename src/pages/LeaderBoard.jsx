import React from 'react'
import useStore from '../store/useStore'
import { getTotalKg } from '../utils/calculations'

const RANK_ICONS = ['🥇', '🥈', '🥉']

const BADGE_META = {
  'eco-champion': { label: 'Eco Champion', color: '#16a34a', bg: '#dcfce7' },
  'green-starter': { label: 'Green Starter', color: '#65a30d', bg: '#ecfccb' },
  'reducing': { label: 'Reducing', color: '#d97706', bg: '#fef3c7' },
  'aware': { label: 'Aware', color: '#0284c7', bg: '#e0f2fe' },
  'beginner': { label: 'Beginner', color: '#9333ea', bg: '#f3e8ff' },
}

export default function LeaderBoard() {
  const { team, footprint, user } = useStore()
  const myTotal = getTotalKg(footprint)

  const sorted = [...team.members].sort((a, b) => a.footprint - b.footprint)
  const myRank = sorted.findIndex(m => m.id === 1) + 1
  const teamSaved = team.members.reduce((sum, m) => sum + Math.max(0, 14 - m.footprint), 0).toFixed(1)
  const teamGoalPct = Math.min(100, Math.round((+teamSaved / team.weeklyGoal) * 100))

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-teal-900 px-4 pt-12 pb-5 shadow-md rounded-b-3xl md:rounded-3xl md:mx-4 md:mt-4">
        <h1 className="text-white text-xl font-semibold">{team.name}</h1>
        <p className="text-forest-400 text-xs mt-1">Weekly leaderboard — lowest footprint wins</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-forest-800 rounded-xl p-3 text-center">
            <div className="text-white text-lg font-semibold">#{myRank}</div>
            <div className="text-forest-400 text-[10px] mt-0.5">Your rank</div>
          </div>
          <div className="bg-forest-800 rounded-xl p-3 text-center">
            <div className="text-green-400 text-lg font-semibold">{teamSaved}</div>
            <div className="text-forest-400 text-[10px] mt-0.5">kg saved total</div>
          </div>
          <div className="bg-forest-800 rounded-xl p-3 text-center">
            <div className="text-amber-400 text-lg font-semibold">{team.members.length}</div>
            <div className="text-forest-400 text-[10px] mt-0.5">members</div>
          </div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-6 md:px-4 md:mt-4">
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Rankings */}
          <div className="mx-4 mt-4 md:mx-0 md:mt-0">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">This week's ranking</h2>
            <div className="space-y-2 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              {sorted.map((member, idx) => {
                const isMe = member.id === 1
                const badge = BADGE_META[member.badge] || BADGE_META.beginner
                const footprintVal = isMe ? myTotal : member.footprint

                return (
                  <div
                    key={member.id}
                    className={`bg-white/70 backdrop-blur-md border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border rounded-xl p-3 flex items-center gap-3 transition-all ${
                      isMe ? 'border-forest-200 shadow-sm bg-green-50/50' : 'hover:border-gray-300'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {idx < 3
                        ? <span className="text-xl">{RANK_ICONS[idx]}</span>
                        : <span className="text-sm font-medium text-gray-400">{idx + 1}</span>
                      }
                    </div>

                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                      isMe ? 'bg-forest-100 ring-2 ring-forest-400' : 'bg-gray-100'
                    }`}>
                      {member.avatar}
                    </div>

                    {/* Name & badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium truncate ${isMe ? 'text-forest-800' : 'text-gray-900'}`}>
                          {isMe ? user.name : member.name}
                        </span>
                        {isMe && <span className="text-[9px] bg-forest-100 text-forest-700 px-1.5 py-0.5 rounded-full font-medium">you</span>}
                      </div>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-md mt-0.5 inline-block"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Footprint */}
                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-semibold ${footprintVal <= 7 ? 'text-green-600' : footprintVal <= 11 ? 'text-amber-600' : 'text-red-500'}`}>
                        {footprintVal} kg
                      </div>
                      <div className="text-[10px] text-gray-400">CO₂/day</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6 mx-4 md:mx-0 md:mt-0 lg:col-span-1 md:col-span-2">
          {/* Team Challenge */}
          <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-lg">🏆</span>
              <div>
                <div className="text-sm font-semibold text-gray-900">Team weekly goal</div>
                <div className="text-xs text-gray-500">Get team average below {team.weeklyGoal} kg/day</div>
              </div>
              <span className="text-xs font-semibold text-forest-700">{teamGoalPct}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${teamGoalPct}%`,
                  background: teamGoalPct >= 100 ? '#16a34a' : teamGoalPct >= 60 ? '#d97706' : '#ef4444'
                }}
              />
            </div>
          </div>

          {/* Motivational tip */}
          {myRank > 1 && (
            <div className="bg-amber-50/50 backdrop-blur-md border border-amber-100 rounded-xl p-4">
              <p className="text-xs text-amber-800 leading-relaxed">
                ⚡ You're <strong>{(sorted[myRank - 1]?.footprint - myTotal).toFixed(1)} kg</strong> away from rank #{myRank - 1}. Complete one more action today to climb the board!
              </p>
            </div>
          )}
          {/* Nudge */}
          <div className="bg-green-50/70 backdrop-blur-md border border-white/50 rounded-xl p-4 flex gap-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <span className="text-xl flex-shrink-0">💡</span>
            <p className="text-xs text-green-800 leading-relaxed">
              🏆 You're leading the team! Keep it up and inspire others to reduce their footprint too.
            </p>
          </div>

          {/* Invite */}
          <div className="bg-white/50 backdrop-blur-md border border-dashed border-gray-300 rounded-xl p-4 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-500">👥</div>
            <div className="text-sm font-medium text-gray-800">Invite a friend</div>
            <div className="text-xs text-gray-500 mt-0.5">More members = more accountability</div>
            <button className="mt-3 text-xs font-medium text-forest-700 border border-forest-300 px-4 py-1.5 rounded-lg hover:bg-forest-50 transition-colors">
              Share invite link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
