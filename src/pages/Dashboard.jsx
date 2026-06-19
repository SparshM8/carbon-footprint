import React, { useMemo } from 'react'
import useStore from '../store/useStore'
import FootprintRing from '../components/FootprintRing'
import NudgeSystem from '../components/NudgeSystem'
import { getTotalKg, getCO2Level, getEquivalent, GLOBAL_AVERAGE, INDIA_AVERAGE, SUSTAINABLE_TARGET, getLevelInfo } from '../utils/calculations'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CATEGORY_META = {
  transport: { label: 'Transport', icon: '🚗', color: '#378ADD' },
  food: { label: 'Food', icon: '🍽️', color: '#EF9F27' },
  energy: { label: 'Energy', icon: '⚡', color: '#7F77DD' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#D4537E' },
  digital: { label: 'Digital', icon: '💻', color: '#1D9E75' },
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const total = payload.reduce((a, b) => a + (b.value || 0), 0)
    return (
      <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm text-xs">
        <div className="font-medium text-gray-700 mb-1">{label}</div>
        <div className="font-semibold text-gray-900">{total.toFixed(1)} kg CO₂</div>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { user, footprint, weeklyData, setPage } = useStore()
  const total = getTotalKg(footprint)
  const level = getCO2Level(total)
  const levelInfo = getLevelInfo(user.xp)
  const xpPct = Math.round(((user.xp - levelInfo.min) / (levelInfo.max - levelInfo.min)) * 100)

  const biggestCategory = useMemo(() => {
    return Object.entries(footprint).sort((a, b) => b[1] - a[1])[0]
  }, [footprint])

  const vsGlobal = (((GLOBAL_AVERAGE - total) / GLOBAL_AVERAGE) * 100).toFixed(0)
  const vsTarget = total - SUSTAINABLE_TARGET

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-teal-900 px-4 pt-12 pb-4 shadow-md rounded-b-3xl md:rounded-3xl md:mx-4 md:mt-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-forest-400 text-xs font-medium">Good morning, {user.name} 👋</p>
            <h1 className="text-white text-2xl font-semibold mt-0.5">
              {total} <span className="text-forest-400 text-base font-normal">kg CO₂ today</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: level.bg, color: level.color }}
              >
                {level.label}
              </span>
              <span className="text-forest-400 text-xs">🔥 {user.streak}-day streak</span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-11 h-11 rounded-full bg-forest-700 border-2 border-forest-500 flex items-center justify-center text-xl">
              🌱
            </div>
            <div className="text-forest-400 text-[10px] mt-0.5">Lv. {levelInfo.level}</div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-forest-400 mb-1">
            <span>{user.xp} XP — {levelInfo.title}</span>
            <span>Lv.{levelInfo.level + 1} at {levelInfo.max} XP</span>
          </div>
          <div className="h-1.5 bg-forest-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-forest-400 rounded-full transition-all duration-700"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Nudges */}
      <NudgeSystem />

      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:px-4 md:mt-4">
        {/* Donut ring */}
        <div className="mx-4 mt-4 md:mx-0 md:mt-0 bg-white/70 backdrop-blur-md rounded-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 flex flex-col">
          <div className="px-4 pt-3 pb-1 flex items-center justify-between flex-shrink-0">
            <h2 className="text-sm font-semibold text-gray-800">Today's breakdown</h2>
            <span className="text-xs text-gray-400">{getEquivalent(total)}</span>
          </div>
          <div className="flex-1 flex items-center justify-center pb-2">
            <FootprintRing footprint={footprint} />
          </div>
        </div>

        {/* Center column */}
        <div className="flex flex-col gap-3 mx-4 mt-3 md:mx-0 md:mt-0">
          {/* Biggest lever */}
          <div className="bg-amber-50/80 backdrop-blur-md border border-white/50 rounded-xl p-3 flex gap-3 items-start h-full hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
            <span className="text-2xl">{CATEGORY_META[biggestCategory[0]]?.icon}</span>
            <div>
              <p className="text-sm font-medium text-amber-900">
                {CATEGORY_META[biggestCategory[0]]?.label} is your biggest lever
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {biggestCategory[1].toFixed(1)} kg CO₂ — reducing this has the highest impact on your total.
              </p>
              <button
                onClick={() => setPage('actions')}
                className="mt-2 text-xs font-medium text-amber-800 underline underline-offset-2"
              >
                See actions →
              </button>
            </div>
          </div>

          {/* Benchmarks */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Global avg</div>
              <div className="text-base font-semibold text-gray-800">{GLOBAL_AVERAGE}</div>
              <div className="text-[10px] text-green-600 mt-0.5">You save {vsGlobal}%</div>
            </div>
            <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">India avg</div>
              <div className="text-base font-semibold text-gray-800">{INDIA_AVERAGE}</div>
              <div className={`text-[10px] mt-0.5 ${total < INDIA_AVERAGE ? 'text-green-600' : 'text-red-500'}`}>
                {total < INDIA_AVERAGE ? `↓ ${(INDIA_AVERAGE - total).toFixed(1)} below` : `↑ ${(total - INDIA_AVERAGE).toFixed(1)} above`}
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">1.5°C target</div>
              <div className="text-base font-semibold text-gray-800">{SUSTAINABLE_TARGET}</div>
              <div className={`text-[10px] mt-0.5 ${vsTarget <= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {vsTarget <= 0 ? '✓ On track!' : `${vsTarget.toFixed(1)} to go`}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3 mx-4 mt-3 md:mx-0 md:mt-0 lg:col-span-1 md:col-span-2">
          {/* Weekly chart */}
          <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">This week</h2>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyData} barSize={24} barGap={4}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="transport" stackId="a" fill="#378ADD" />
                <Bar dataKey="food" stackId="a" fill="#EF9F27" />
                <Bar dataKey="energy" stackId="a" fill="#7F77DD" />
                <Bar dataKey="shopping" stackId="a" fill="#D4537E" />
                <Bar dataKey="digital" stackId="a" fill="#1D9E75" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {Object.entries(CATEGORY_META).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: v.color }} />
                  <span className="text-[10px] text-gray-500">{v.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions CTA */}
          <div>
            <button
              onClick={() => setPage('actions')}
              className="w-full bg-forest-600 hover:bg-forest-700 active:scale-95 text-white text-sm font-medium py-3 rounded-xl transition-all duration-200"
            >
              View today's challenges →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
