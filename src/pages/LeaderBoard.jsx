import React, { useState } from 'react'
import useStore from '../store/useStore'
import { getTotalKg } from '../utils/calculations'
import { Trophy, Users, Copy, Check, Heart, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

const RANK_ICONS = ['🥇', '🥈', '🥉']

const BADGE_META = {
  'eco-champion': { label: 'Eco Champion', color: '#005a3c', bg: '#d5f3df' },
  'green-starter': { label: 'Green Starter', color: '#4d7c0f', bg: '#ecfccb' },
  'reducing': { label: 'Reducing', color: '#b45309', bg: '#fef3c7' },
  'aware': { label: 'Aware', color: '#0369a1', bg: '#e0f2fe' },
  'beginner': { label: 'Beginner', color: '#7e22ce', bg: '#f3e8ff' },
}

export default function LeaderBoard() {
  const { team, footprint, user, sendTeamKudos } = useStore()
  const myTotal = getTotalKg(footprint)
  const [copied, setCopied] = useState(false)
  const [kudosToast, setKudosToast] = useState(null)

  // Integrate live user footprint into team list
  const membersWithMe = team.members.map((m) =>
    m.id === 1 ? { ...m, footprint: myTotal } : m
  )
  const sorted = [...membersWithMe].sort((a, b) => a.footprint - b.footprint)
  const myRank = sorted.findIndex((m) => m.id === 1) + 1
  const teamSaved = membersWithMe
    .reduce((sum, m) => sum + Math.max(0, 14 - m.footprint), 0)
    .toFixed(1)
  const teamGoalPct = Math.min(100, Math.round((+teamSaved / team.weeklyGoal) * 100))
  const personAhead = myRank > 1 ? sorted[myRank - 2] : null
  const diffKg = personAhead ? Math.abs(personAhead.footprint - myTotal).toFixed(1) : '0.0'

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKudos = (member) => {
    sendTeamKudos(member.id)
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#005a3c', '#c9f34a', '#ec4899'],
    })
    setKudosToast(`Sent cheers to ${member.name}! 🙌`)
    setTimeout(() => setKudosToast(null), 2500)
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Toast Notification */}
      {kudosToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#005a3c] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom duration-200 flex items-center gap-2">
          <Sparkles className="size-4 text-[#c9f34a]" />
          <span>{kudosToast}</span>
        </div>
      )}

      {/* Header matching Carbonly theme */}
      <header className="flex flex-col gap-3 pt-4 md:pt-8 mb-6">
        <p className="flex items-center gap-2 text-sm font-medium text-[#005a3c]">
          <span className="size-2 rounded-full bg-[#005a3c]" /> Community & Social Accountability
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[#062b20] md:text-5xl">
          {team.name} <em className="font-serif text-[#005a3c]">League.</em>
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-[#6f7f78] md:text-base">
          Track collective progress with teammates. Friendly competition and mutual kudos keep everyone motivated to minimize emissions.
        </p>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-3 mt-4 max-w-2xl">
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-[#005a3c]">#{myRank}</div>
            <div className="text-[#718079] text-xs mt-0.5">Your ranking</div>
          </div>
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-[#062b20]">{teamSaved}</div>
            <div className="text-[#718079] text-xs mt-0.5">kg saved total</div>
          </div>
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-[#b45309]">{team.members.length}</div>
            <div className="text-[#718079] text-xs mt-0.5">Teammates</div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* Rankings Table/List */}
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#f0ece1] mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-[#005a3c]" />
                <h2 className="text-sm font-semibold text-[#062b20]">Weekly Leaderboard</h2>
              </div>
              <span className="text-xs text-[#718079]">Lowest footprint wins 🏆</span>
            </div>

            <div className="space-y-2">
              {sorted.map((member, idx) => {
                const isMe = member.id === 1
                const badge = BADGE_META[member.badge] || BADGE_META.beginner
                const footprintVal = isMe ? myTotal : member.footprint

                return (
                  <div
                    key={member.id}
                    className={`rounded-2xl border p-3.5 flex items-center gap-3 transition-all ${
                      isMe
                        ? 'border-[#005a3c]/40 bg-[#f4f9f5] ring-1 ring-[#005a3c]/30 shadow-xs'
                        : 'border-[#ede9dc] bg-[#fffdf8] hover:border-[#ded8c9]'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {idx < 3 ? (
                        <span className="text-xl">{RANK_ICONS[idx]}</span>
                      ) : (
                        <span className="text-sm font-semibold text-[#8b9891]">#{idx + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-xs ${
                        isMe
                          ? 'bg-[#d5f3df] text-[#005a3c] ring-2 ring-[#005a3c]/20'
                          : 'bg-[#f4efe4] text-[#4d5e56]'
                      }`}
                    >
                      {member.avatar}
                    </div>

                    {/* Name & badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm truncate ${
                            isMe ? 'text-[#062b20] font-bold' : 'text-[#1c332a] font-medium'
                          }`}
                        >
                          {isMe ? user?.name || 'You' : member.name}
                        </span>
                        {isMe && (
                          <span className="text-[10px] bg-[#d5f3df] text-[#005a3c] px-2 py-0.5 rounded-full font-semibold">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block"
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {/* Kudos Button */}
                    <button
                      onClick={() => handleKudos(member)}
                      className="inline-flex items-center gap-1 rounded-full border border-[#ede9dc] bg-[#f8f6ef] px-2.5 py-1 text-xs font-semibold text-[#005a3c] hover:bg-[#d5f3df] transition active:scale-95 shadow-xs"
                      title={`Send kudos to ${member.name}`}
                    >
                      <Heart className="size-3 text-rose-500 fill-rose-500" />
                      <span>{member.kudos || 0}</span>
                    </button>

                    {/* Footprint */}
                    <div className="text-right flex-shrink-0 w-16">
                      <div
                        className={`text-sm font-bold ${
                          footprintVal <= 7
                            ? 'text-[#005a3c]'
                            : footprintVal <= 11
                            ? 'text-[#b45309]'
                            : 'text-[#dc2626]'
                        }`}
                      >
                        {footprintVal.toFixed(1)} kg
                      </div>
                      <div className="text-[10px] text-[#8b9891]">CO₂ / day</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Goal & Team Tools */}
        <div className="flex flex-col gap-6">
          {/* Team Challenge */}
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-[#718079]">Weekly Team Challenge</p>
                <h3 className="text-base font-semibold text-[#062b20] mt-0.5">
                  Average &lt; {team.weeklyGoal} kg/day
                </h3>
              </div>
              <span className="text-sm font-bold text-[#005a3c]">{teamGoalPct}%</span>
            </div>
            <div className="h-2.5 bg-[#ede8dc] rounded-full overflow-hidden mt-3">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${teamGoalPct}%`,
                  background:
                    teamGoalPct >= 100 ? '#005a3c' : teamGoalPct >= 60 ? '#b45309' : '#dc2626',
                }}
              />
            </div>
            <p className="text-xs text-[#718079] mt-3">
              Team has saved <strong>{teamSaved} kg CO₂</strong> so far this week!
            </p>
          </div>

          {/* Motivational Tip if behind */}
          {myRank > 1 && personAhead && (
            <div className="rounded-2xl border border-[#fed7aa] bg-[#fffbf5] p-5 shadow-xs">
              <p className="text-xs text-[#9a3412] leading-relaxed">
                ⚡ You&apos;re only <strong>{diffKg} kg</strong> away from #{myRank - 1} ({personAhead.name}).
                Complete one challenge today to climb to rank #{myRank - 1}!
              </p>
            </div>
          )}

          {/* Leading Card */}
          {myRank === 1 && (
            <div className="rounded-2xl border border-[#d5f3df] bg-[#f0f9f3] p-5 shadow-xs flex gap-3">
              <span className="text-2xl">🏆</span>
              <p className="text-xs text-[#1e503b] leading-relaxed">
                <strong>You are currently leading the team!</strong> Your low footprint inspires your teammates
                to push harder.
              </p>
            </div>
          )}

          {/* Invite Teammates */}
          <div className="rounded-2xl border border-dashed border-[#d8d2c4] bg-[#fffdf8] p-6 text-center">
            <div className="w-12 h-12 bg-[#f4efe4] rounded-full flex items-center justify-center mx-auto mb-2 text-[#005a3c]">
              <Users className="size-5" />
            </div>
            <h4 className="text-sm font-semibold text-[#062b20]">Invite Teammates</h4>
            <p className="text-xs text-[#718079] mt-1 max-w-xs mx-auto">
              More members mean greater accountability and multiplied climate impact.
            </p>
            <button
              onClick={handleShare}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#005a3c] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#00452f] active:scale-95 shadow-xs"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? 'Link Copied!' : 'Share Team Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
