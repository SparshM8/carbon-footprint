import React, { useMemo, useState } from 'react'
import useStore from '../store/useStore'
import LogActivityModal from '../components/LogActivityModal'
import { getTotalKg, GLOBAL_AVERAGE, INDIA_AVERAGE, SUSTAINABLE_TARGET } from '../utils/calculations'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowDownRight, ArrowUpRight, ChevronDown, Leaf, MoreHorizontal, Plane, Plus, ShoppingBasket, TrainFront, Recycle, SlidersHorizontal } from 'lucide-react'

const CATEGORY_META = {
  transport: { label: 'Travel', color: '#ffb25f' },
  food: { label: 'Food & diet', color: '#9ade4f' },
  energy: { label: 'Home energy', color: '#005a3c' },
  shopping: { label: 'Shopping', color: '#9ed1e5' },
  digital: { label: 'Lifestyle', color: '#8bcce8' },
}

const recentLogs = [
  { title: 'Flight to Lisbon', meta: 'Travel · Today', value: '412 kg', icon: Plane, tone: 'orange' },
  { title: 'Weekly groceries', meta: 'Food · Yesterday', value: '28 kg', icon: ShoppingBasket, tone: 'lime' },
  { title: 'Train commute', meta: 'Transport · May 28', value: '6 kg', icon: TrainFront, tone: 'blue' },
  { title: 'Recycling drop-off', meta: 'Lifestyle · May 27', value: '−4 kg', icon: Recycle, tone: 'purple' },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((sum, item) => sum + (item.value || 0), 0)
  return <div className="rounded-xl border border-[#e8e4d8] bg-[#fffdf8] px-3 py-2 text-xs shadow-lg"><p className="font-medium text-[#738078]">{label}</p><p className="mt-1 font-semibold text-[#082a20]">{total.toFixed(1)} kg CO₂</p></div>
}

export default function Dashboard() {
  const { user, footprint, weeklyData, setPage } = useStore()
  const [showLogModal, setShowLogModal] = useState(false)
  const total = getTotalKg(footprint)
  const biggest = useMemo(() => Object.entries(footprint).sort((a, b) => b[1] - a[1])[0] || ['energy', 0], [footprint])
  const vsGlobal = Math.max(0, Math.round(((GLOBAL_AVERAGE - total) / GLOBAL_AVERAGE) * 100))
  const score = Math.max(0, Math.min(100, Math.round(100 - total * 4)))
  const chartData = weeklyData?.length ? weeklyData : [{ day: 'Mon', transport: 2, food: 2, energy: 2 }, { day: 'Tue', transport: 2, food: 1, energy: 2 }, { day: 'Wed', transport: 1, food: 2, energy: 2 }, { day: 'Thu', transport: 2, food: 2, energy: 1 }, { day: 'Fri', transport: 2, food: 1, energy: 2 }, { day: 'Sat', transport: 1, food: 2, energy: 1 }, { day: 'Sun', transport: 1, food: 1, energy: 1 }]

  return (
    <div className="min-h-screen pb-8">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-7 pt-4 md:flex-row md:items-end md:justify-between md:pt-8">
          <div><p className="mb-3 flex items-center gap-2 text-sm font-medium text-[#005a3c]"><span className="size-2 rounded-full bg-[#005a3c]" /> Personal impact dashboard</p><h1 className="max-w-3xl text-4xl leading-[1.05] tracking-[-0.055em] text-[#062b20] md:text-6xl">Make your footprint <em className="font-serif text-[#005a3c]">lighter.</em></h1><p className="mt-5 max-w-xl text-base leading-7 text-[#6f7f78] md:text-lg">A clearer view of the choices that shape your carbon impact — and the small changes that add up.</p></div>
          <button onClick={() => setShowLogModal(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#005a3c] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#005a3c]/20 transition hover:-translate-y-0.5 hover:bg-[#00452f]"><Plus data-icon="inline-start" /> Log an activity</button>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Your footprint" value={`${total} kg`} detail="vs. last period" badge="↓ 12% less" positive />
          <StatCard label="Monthly goal" value="200 kg" detail="goal reached" badge="↗ 78%" />
          <StatCard label="Best category" value={CATEGORY_META[biggest[0]]?.label || 'Home energy'} detail="since January" badge="↘ −34%" positive />
          <div className="relative overflow-hidden rounded-2xl bg-[#005a3c] p-6 text-white shadow-lg shadow-[#005a3c]/15"><Leaf className="absolute -right-2 -top-2 size-24 rotate-12 text-white/10" /><p className="text-sm text-emerald-100">Impact score</p><div className="mt-6 flex items-end gap-2"><span className="text-5xl tracking-tight">{score}</span><span className="mb-2 text-sm text-emerald-200">/ 100</span></div><div className="mt-5 h-2 rounded-full bg-white/20"><div className="h-full rounded-full bg-[#c9f34a]" style={{ width: `${score}%` }} /></div><p className="mt-3 text-sm text-emerald-100">You&apos;re in the top 18% this month</p></div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-[#718079]">Emissions over time</p><div className="mt-2 flex items-center gap-3"><h2 className="text-3xl tracking-tight text-[#062b20]">2,408 kg</h2><span className="text-sm font-medium text-[#005a3c]">↘ 12.4%</span></div></div><div className="flex items-center gap-3"><SlidersHorizontal className="hidden size-4 text-[#738078] sm:block" /><button className="flex items-center gap-5 rounded-full border border-[#e4dfd2] px-3 py-2 text-sm text-[#243a32]">3 months <ChevronDown className="size-4" /></button></div></div><div className="mt-6 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} barSize={30}><XAxis dataKey="day" tick={{ fontSize: 12, fill: '#89958f' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f0e8' }} /><Bar dataKey="transport" stackId="a" fill="#cdd9d1" radius={[8, 8, 0, 0]} /><Bar dataKey="food" stackId="a" fill="#cdd9d1" /><Bar dataKey="energy" stackId="a" fill="#005a3c" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-[#718079]">Where it comes from</p><h2 className="mt-2 text-2xl tracking-tight text-[#062b20]">By category</h2></div><MoreHorizontal className="size-5 text-[#738078]" /></div><div className="mt-6 flex items-center gap-6"><Donut footprint={footprint} /><div className="flex flex-1 flex-col gap-4">{Object.entries(CATEGORY_META).slice(0, 4).map(([key, meta], index) => <div key={key} className="flex items-center gap-3 text-sm"><span className="size-3 rounded-full" style={{ background: meta.color }} /><span className="flex-1 text-[#718079]">{meta.label}</span><span className="font-medium text-[#1b3028]">{[40, 28, 20, 12][index]}%</span></div>)}</div></div><div className="mt-6 flex gap-3 rounded-2xl bg-[#f4f0e3] p-4 text-sm leading-5 text-[#5e6d64]"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#c9f34a] text-[#005a3c]"><Leaf className="size-4" /></span><p><strong className="text-[#18362b]">Your biggest win:</strong> switching to a renewable energy plan could save 480 kg CO₂e each year.</p></div></div>
        </section>

        <section><div className="mb-4 flex items-end justify-between"><div><p className="text-sm text-[#718079]">Recent activity</p><h2 className="mt-1 text-2xl tracking-tight text-[#062b20]">Your latest logs</h2></div><button onClick={() => setPage('actions')} className="text-sm font-medium text-[#005a3c] hover:underline">View all activity</button></div><div className="overflow-hidden rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] shadow-sm">{recentLogs.map(({ title, meta, value, icon: Icon, tone }) => <div key={title} className="flex items-center gap-4 border-b border-[#ebe7dc] px-6 py-4 last:border-0"><span className={`grid size-10 place-items-center rounded-full ${tone === 'orange' ? 'bg-orange-100 text-orange-600' : tone === 'lime' ? 'bg-lime-100 text-lime-700' : tone === 'blue' ? 'bg-sky-100 text-sky-600' : 'bg-violet-100 text-violet-600'}`}><Icon className="size-5" /></span><div className="flex-1"><p className="font-medium text-[#132e25]">{title}</p><p className="text-sm text-[#89958f]">{meta}</p></div><span className="font-medium text-[#132e25]">{value}</span></div>)}</div></section>
      </div>
      <LogActivityModal isOpen={showLogModal} onClose={() => setShowLogModal(false)} />
    </div>
  )
}

function StatCard({ label, value, detail, badge, positive }) { return <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-6 shadow-sm"><p className="text-sm text-[#718079]">{label}</p><div className="mt-6 flex items-center justify-between gap-2"><p className="truncate text-3xl tracking-tight text-[#062b20]">{value}</p><span className={`rounded-full px-3 py-1 text-xs font-medium ${positive ? 'bg-[#eafbba] text-[#567b12]' : 'bg-[#f0ead5] text-[#6f6e4f]'}`}>{badge}</span></div><p className="mt-2 text-sm text-[#89958f]">{detail}</p></div> }

function Donut({ footprint }) { const total = Object.values(footprint).reduce((a, b) => a + b, 0) || 1; let current = 0; const colors = ['#005a3c', '#9ade4f', '#ffb25f', '#9ed1e5', '#c8d9d2']; const stops = Object.values(footprint).map((value, index) => { const start = current; current += (value / total) * 360; return `${colors[index]} ${start}deg ${current}deg` }).join(', '); return <div className="relative size-36 shrink-0 rounded-full" style={{ background: `conic-gradient(${stops})` }}><div className="absolute inset-5 grid place-items-center rounded-full bg-[#fffdf8] text-center"><strong className="text-xl text-[#082a20]">{total.toFixed(1)}t</strong><span className="text-[10px] text-[#89958f]">total CO₂e</span></div></div> }
