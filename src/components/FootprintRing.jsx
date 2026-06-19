import React, { useEffect, useState } from 'react'
import { getTotalKg, getCO2Level } from '../utils/calculations'

const COLORS = {
  transport: '#378ADD',
  food: '#EF9F27',
  energy: '#7F77DD',
  shopping: '#D4537E',
  digital: '#1D9E75',
}

const LABELS = {
  transport: 'Transport',
  food: 'Food',
  energy: 'Energy',
  shopping: 'Shopping',
  digital: 'Digital',
}

const R = 70
const STROKE = 16
const CIRCUMFERENCE = 2 * Math.PI * R
const CX = 100
const CY = 100

export default function FootprintRing({ footprint }) {
  const [animated, setAnimated] = useState(false)
  const total = getTotalKg(footprint)
  const level = getCO2Level(total)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  const segments = []
  let offset = 0
  const entries = Object.entries(footprint).filter(([, v]) => v > 0)

  entries.forEach(([key, val]) => {
    const frac = val / Math.max(total, 0.01)
    const dash = frac * CIRCUMFERENCE
    const gap = CIRCUMFERENCE - dash
    segments.push({ key, val, dash, gap, offset, color: COLORS[key] })
    offset += dash
  })

  return (
    <div className="flex flex-row items-center gap-2 lg:gap-4 px-2 w-full justify-center">
      <div className="relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40">
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-label={`Carbon footprint ring: ${total} kg CO₂ total`}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
          {segments.map(seg => (
            <circle
              key={seg.key}
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${animated ? seg.dash : 0} ${CIRCUMFERENCE}`}
              strokeDashoffset={-seg.offset + CIRCUMFERENCE / 4}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s ease', transformOrigin: `${CX}px ${CY}px` }}
            />
          ))}
          <text x={CX} y={CY - 8} textAnchor="middle" fontSize="22" fontWeight="500" fill="#0f172a">{total}</text>
          <text x={CX} y={CY + 10} textAnchor="middle" fontSize="11" fill="#64748b">kg CO₂</text>
          <text x={CX} y={CY + 26} textAnchor="middle" fontSize="10" fill={level.color} fontWeight="500">{level.label}</text>
        </svg>
      </div>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-2">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: COLORS[key] }} />
            <span className="text-xs text-gray-500 w-14 flex-shrink-0 truncate">{LABELS[key]}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: animated ? `${(val / total) * 100}%` : '0%',
                  background: COLORS[key],
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 w-6 text-right flex-shrink-0">{val.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
