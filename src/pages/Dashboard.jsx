import React, { useMemo, useState } from 'react'
import useStore from '../store/useStore'
import LogActivityModal from '../components/LogActivityModal'
import ShareImpactModal from '../components/ShareImpactModal'
import { getTotalKg, GLOBAL_AVERAGE, SUSTAINABLE_TARGET } from '../utils/calculations'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  ChevronDown,
  Leaf,
  MoreHorizontal,
  Plus,
  SlidersHorizontal,
  Trash2,
  Share2,
  Car,
  UtensilsCrossed,
  Zap,
  ShoppingBag,
  Laptop,
  Target,
  Edit2,
  Camera,
  CheckCircle2,
} from 'lucide-react'

const CATEGORY_META = {
  transport: { label: 'Travel', color: '#ffb25f', icon: Car },
  food: { label: 'Food & diet', color: '#9ade4f', icon: UtensilsCrossed },
  energy: { label: 'Home energy', color: '#005a3c', icon: Zap },
  shopping: { label: 'Shopping', color: '#9ed1e5', icon: ShoppingBag },
  digital: { label: 'Lifestyle', color: '#8bcce8', icon: Laptop },
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((sum, item) => sum + (item.value || 0), 0)
  return (
    <div className="rounded-xl border border-[#e8e4d8] bg-[#fffdf8] px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-[#738078]">{label}</p>
      <p className="mt-1 font-semibold text-[#082a20]">{total.toFixed(1)} kg CO₂</p>
    </div>
  )
}

function formatRelativeTime(isoString) {
  if (!isoString) return 'Recently'
  try {
    const diffMs = Date.now() - new Date(isoString).getTime()
    const diffMins = Math.floor(diffMs / (60 * 1000))
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays}d ago`
  } catch {
    return 'Recently'
  }
}

export default function Dashboard() {
  const {
    user,
    footprint,
    weeklyData,
    setPage,
    activityLogs = [],
    deleteActivityLog,
    monthlyBudget = 150,
    setMonthlyBudget,
  } = useStore()

  const [showLogModal, setShowLogModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [customBudgetInput, setCustomBudgetInput] = useState(monthlyBudget)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const total = getTotalKg(footprint)
  const biggest = useMemo(
    () => Object.entries(footprint).sort((a, b) => b[1] - a[1])[0] || ['energy', 0],
    [footprint]
  )
  const vsGlobal = Math.max(0, Math.round(((GLOBAL_AVERAGE - total) / GLOBAL_AVERAGE) * 100))
  const score = Math.max(0, Math.min(100, Math.round(100 - total * 4)))

  // Monthly Budget Forecasting
  const projectedMonthlyTotal = Math.round(total * 30)
  const budgetPctUsed = Math.min(100, Math.round((projectedMonthlyTotal / (monthlyBudget || 150)) * 100))
  const isUnderBudget = projectedMonthlyTotal <= monthlyBudget

  const chartData = weeklyData?.length
    ? weeklyData
    : [
        { day: 'Mon', transport: 2, food: 2, energy: 2 },
        { day: 'Tue', transport: 2, food: 1, energy: 2 },
        { day: 'Wed', transport: 1, food: 2, energy: 2 },
        { day: 'Thu', transport: 2, food: 2, energy: 1 },
        { day: 'Fri', transport: 2, food: 1, energy: 2 },
        { day: 'Sat', transport: 1, food: 2, energy: 1 },
        { day: 'Sun', transport: 1, food: 1, energy: 1 },
      ]

  const filteredLogs = useMemo(() => {
    if (selectedFilter === 'all') return activityLogs
    return activityLogs.filter((log) => log.category === selectedFilter)
  }, [activityLogs, selectedFilter])

  const handleSaveBudget = (e) => {
    e.preventDefault()
    const val = Math.max(20, Math.min(1000, Number(customBudgetInput) || 150))
    setMonthlyBudget(val)
    setShowBudgetModal(false)
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-7 pt-4 md:flex-row md:items-end md:justify-between md:pt-8">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-[#005a3c]">
              <span className="size-2 rounded-full bg-[#005a3c]" /> Personal impact dashboard
            </p>
            <h1 className="max-w-3xl text-4xl leading-[1.05] tracking-[-0.055em] text-[#062b20] md:text-6xl">
              Make your footprint <em className="font-serif text-[#005a3c]">lighter.</em>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#6f7f78] md:text-lg">
              A clearer view of the choices that shape your carbon impact — and the small changes that add up.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ded8c9] bg-[#fffdf8] px-5 py-3 font-semibold text-[#005a3c] shadow-xs transition hover:bg-[#f3efe4] active:scale-95"
            >
              <Share2 className="size-4" /> Share My Impact
            </button>
            <button
              onClick={() => setShowLogModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#005a3c] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#005a3c]/20 transition hover:-translate-y-0.5 hover:bg-[#00452f] active:scale-95"
            >
              <Plus className="size-5" /> Log an activity
            </button>
          </div>
        </header>

        {/* 4 Top Metric Cards */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Your daily footprint"
            value={`${total} kg`}
            detail="CO₂ equivalent today"
            badge={`↓ ${vsGlobal}% vs global`}
            positive
          />

          {/* Interactive Monthly Budget Card with Forecast */}
          <div className="relative rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#718079]">Monthly Carbon Budget</p>
              <button
                onClick={() => {
                  setCustomBudgetInput(monthlyBudget)
                  setShowBudgetModal(true)
                }}
                className="text-[11px] font-semibold text-[#005a3c] hover:underline flex items-center gap-1"
                title="Edit target budget"
              >
                <Edit2 className="size-3" /> Edit
              </button>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-2">
              <p className="text-3xl font-bold tracking-tight text-[#062b20]">
                {monthlyBudget} <span className="text-sm font-normal text-[#89958f]">kg</span>
              </p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isUnderBudget ? 'bg-[#eafbba] text-[#4d7c0f]' : 'bg-[#fee2e2] text-[#dc2626]'
                }`}
              >
                {isUnderBudget ? '🟢 On Track' : '⚠️ Over Target'}
              </span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-[#ede8dc] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isUnderBudget ? 'bg-[#005a3c]' : 'bg-[#dc2626]'
                }`}
                style={{ width: `${budgetPctUsed}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[#89958f]">
              Pacing ~<strong className="text-[#062b20]">{projectedMonthlyTotal} kg</strong> this month ({budgetPctUsed}%)
            </p>
          </div>

          <StatCard
            label="Top emission source"
            value={CATEGORY_META[biggest[0]]?.label || 'Home energy'}
            detail={`${biggest[1]} kg CO₂ today`}
            badge="Focus Area"
          />

          {/* Impact Score */}
          <div className="relative overflow-hidden rounded-2xl bg-[#005a3c] p-6 text-white shadow-lg shadow-[#005a3c]/15">
            <Leaf className="absolute -right-2 -top-2 size-24 rotate-12 text-white/10" />
            <p className="text-sm text-emerald-100">Climate Score</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">{score}</span>
              <span className="mb-2 text-sm text-emerald-200">/ 100</span>
            </div>
            <div className="mt-5 h-2 rounded-full bg-white/20">
              <div className="h-full rounded-full bg-[#c9f34a]" style={{ width: `${score}%` }} />
            </div>
            <p className="mt-3 text-sm text-emerald-100">
              {score >= 70 ? 'Leading the community top 15% 🌟' : 'Completing 1 challenge boosts score +8'}
            </p>
          </div>
        </section>

        {/* Charts & Breakdown */}
        <section className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#718079]">Weekly Emissions Profile</p>
                <div className="mt-2 flex items-center gap-3">
                  <h2 className="text-3xl font-semibold tracking-tight text-[#062b20]">
                    {(total * 7).toFixed(1)} kg
                  </h2>
                  <span className="text-sm font-medium text-[#005a3c]">↘ 12.4% vs last week</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="hidden size-4 text-[#738078] sm:block" />
                <button className="flex items-center gap-2 rounded-full border border-[#e4dfd2] px-3 py-1.5 text-xs font-semibold text-[#243a32]">
                  7 Days <ChevronDown className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={28}>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#89958f' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f0e8' }} />
                  <Bar dataKey="transport" stackId="a" fill="#ffb25f" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="food" stackId="a" fill="#9ade4f" />
                  <Bar dataKey="energy" stackId="a" fill="#005a3c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#718079]">Where it comes from</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#062b20]">By category</h2>
              </div>
              <MoreHorizontal className="size-5 text-[#738078]" />
            </div>
            <div className="mt-6 flex items-center gap-6">
              <Donut footprint={footprint} />
              <div className="flex flex-1 flex-col gap-3">
                {Object.entries(CATEGORY_META).slice(0, 4).map(([key, meta]) => {
                  const val = footprint[key] || 0
                  const pct = total > 0 ? Math.round((val / total) * 100) : 0
                  return (
                    <div key={key} className="flex items-center gap-3 text-sm">
                      <span className="size-3 rounded-full" style={{ background: meta.color }} />
                      <span className="flex-1 text-[#718079]">{meta.label}</span>
                      <span className="font-semibold text-[#1b3028]">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt-6 flex gap-3 rounded-2xl bg-[#f4f0e3] p-4 text-xs leading-5 text-[#5e6d64]">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#c9f34a] text-[#005a3c]">
                <Leaf className="size-4" />
              </span>
              <p>
                <strong className="text-[#18362b]">Top win:</strong> Replacing 15 km of driving with metro commutes
                saves ~1.8 kg CO₂ daily.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Activity Feed Section */}
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-[#718079]">Live Carbon Activity Feed</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#062b20]">Your latest logs</h2>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {['all', 'transport', 'food', 'energy', 'shopping'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                    selectedFilter === cat
                      ? 'bg-[#005a3c] text-white shadow-xs'
                      : 'border border-[#ede9dc] bg-[#fffdf8] text-[#718079] hover:text-[#062b20]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] shadow-sm">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-[#718079]">No activities found in this filter.</p>
                <button
                  onClick={() => setShowLogModal(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#005a3c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#00452f] transition"
                >
                  <Plus className="size-3.5" /> Log new activity
                </button>
              </div>
            ) : (
              filteredLogs.slice(0, 8).map((log) => {
                const meta = CATEGORY_META[log.category] || CATEGORY_META.transport
                const Icon = meta.icon || Leaf
                const isReduction = (log.impact || 0) < 0
                return (
                  <div
                    key={log.id}
                    className="group flex items-center gap-4 border-b border-[#ebe7dc] px-6 py-4 transition hover:bg-[#fcfaf5] last:border-0"
                  >
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-full"
                      style={{ background: `${meta.color}20`, color: meta.color }}
                    >
                      <Icon className="size-5" />
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-[#132e25] truncate">{log.title}</p>
                        {log.receiptScan && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#d5f3df] px-2 py-0.5 text-[10px] font-semibold text-[#005a3c]">
                            <Camera className="size-3" /> Scanned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#89958f] mt-0.5">
                        {meta.label} · {log.unit || 'action'} · {formatRelativeTime(log.timestamp)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-bold ${
                          isReduction ? 'text-[#005a3c]' : 'text-[#b45309]'
                        }`}
                      >
                        {isReduction ? `${log.impact} kg` : `+${log.impact} kg`}
                      </span>

                      <button
                        onClick={() => deleteActivityLog(log.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[#89958f] hover:text-red-600 rounded-lg transition"
                        title="Delete log"
                        aria-label="Delete log"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>

      {/* Edit Monthly Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-[#e8e4d8] bg-[#fffdf8] p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-semibold text-[#062b20]">Set Monthly Carbon Budget</h3>
            <p className="mt-1 text-xs text-[#718079]">
              Set a monthly limit in kg CO₂ to hold yourself accountable.
            </p>
            <form onSubmit={handleSaveBudget} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#718079] mb-1">Target Budget (kg CO₂e)</label>
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={customBudgetInput}
                  onChange={(e) => setCustomBudgetInput(e.target.value)}
                  className="w-full rounded-xl border border-[#ded8c9] px-3 py-2 text-sm bg-white text-[#062b20] focus:ring-2 focus:ring-[#005a3c] focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="flex-1 rounded-xl border border-[#ded8c9] py-2 text-xs font-semibold text-[#718079] hover:bg-[#f3efe4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#005a3c] py-2 text-xs font-semibold text-white hover:bg-[#00452f]"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <LogActivityModal isOpen={showLogModal} onClose={() => setShowLogModal(false)} />
      <ShareImpactModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  )
}

function StatCard({ label, value, detail, badge, positive }) {
  return (
    <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-6 shadow-sm">
      <p className="text-sm text-[#718079]">{label}</p>
      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="truncate text-3xl font-bold tracking-tight text-[#062b20]">{value}</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            positive ? 'bg-[#eafbba] text-[#567b12]' : 'bg-[#f0ead5] text-[#6f6e4f]'
          }`}
        >
          {badge}
        </span>
      </div>
      <p className="mt-2 text-xs text-[#89958f]">{detail}</p>
    </div>
  )
}

function Donut({ footprint }) {
  const total = Object.values(footprint).reduce((a, b) => a + b, 0) || 1
  let current = 0
  const colors = ['#005a3c', '#9ade4f', '#ffb25f', '#9ed1e5', '#c8d9d2']
  const stops = Object.values(footprint)
    .map((value, index) => {
      const start = current
      current += (value / total) * 360
      return `${colors[index]} ${start}deg ${current}deg`
    })
    .join(', ')

  return (
    <div
      className="relative size-36 shrink-0 rounded-full"
      style={{ background: `conic-gradient(${stops})` }}
    >
      <div className="absolute inset-5 grid place-items-center rounded-full bg-[#fffdf8] text-center">
        <strong className="text-xl font-bold text-[#082a20]">{total.toFixed(1)}kg</strong>
        <span className="text-[10px] text-[#89958f]">daily CO₂e</span>
      </div>
    </div>
  )
}
