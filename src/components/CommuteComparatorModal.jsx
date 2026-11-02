import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useStore from '../store/useStore'
import confetti from 'canvas-confetti'
import {
  Navigation,
  Car,
  Bike,
  TrainFront,
  Bus,
  Footprints,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  TrendingDown,
} from 'lucide-react'

export default function CommuteComparatorModal({ isOpen, onClose }) {
  const { logDailyActivity } = useStore()
  const [distanceKm, setDistanceKm] = useState(15)

  if (!isOpen) return null

  // Calculate dynamic metrics for each mode based on distance
  const modes = [
    {
      id: 'metro',
      title: 'Metro / Rapid Rail',
      icon: TrainFront,
      color: '#005a3c',
      bg: '#f0f9f3',
      border: '#cfe9d5',
      costINR: Math.round(20 + distanceKm * 1.5),
      carbonKg: parseFloat((distanceKm * 0.045).toFixed(2)),
      durationMins: Math.round(distanceKm * 2.2 + 8),
      moneySavedINR: Math.max(80, Math.round(distanceKm * 24 - (20 + distanceKm * 1.5))),
      carbonSavedKg: parseFloat((distanceKm * 0.21 - distanceKm * 0.045).toFixed(2)),
      recommended: true,
      tag: '⭐ Best Value & Speed',
    },
    {
      id: 'walk-cycle',
      title: 'Bicycle / Active Walk',
      icon: Footprints,
      color: '#4d7c0f',
      bg: '#f7fee7',
      border: '#d9f99d',
      costINR: 0,
      carbonKg: 0.0,
      durationMins: Math.round(distanceKm * 4.5),
      caloriesBurned: Math.round(distanceKm * 42),
      moneySavedINR: Math.round(distanceKm * 24),
      carbonSavedKg: parseFloat((distanceKm * 0.21).toFixed(2)),
      tag: '🔥 Burns ~' + Math.round(distanceKm * 42) + ' kcal',
    },
    {
      id: 'bus',
      title: 'Electric / City Bus',
      icon: Bus,
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      costINR: Math.round(15 + distanceKm * 0.8),
      carbonKg: parseFloat((distanceKm * 0.089).toFixed(2)),
      durationMins: Math.round(distanceKm * 3.1 + 10),
      moneySavedINR: Math.max(60, Math.round(distanceKm * 24 - (15 + distanceKm * 0.8))),
      carbonSavedKg: parseFloat((distanceKm * 0.21 - distanceKm * 0.089).toFixed(2)),
      tag: 'Cheapest motorized ride',
    },
    {
      id: 'bike-taxi',
      title: 'Two-Wheeler / Bike Taxi',
      icon: Bike,
      color: '#b45309',
      bg: '#fffbeb',
      border: '#fde68a',
      costINR: Math.round(35 + distanceKm * 8),
      carbonKg: parseFloat((distanceKm * 0.11).toFixed(2)),
      durationMins: Math.round(distanceKm * 2.0),
      moneySavedINR: Math.max(0, Math.round(distanceKm * 24 - (35 + distanceKm * 8))),
      carbonSavedKg: parseFloat((distanceKm * 0.21 - distanceKm * 0.11).toFixed(2)),
      tag: 'Fast traffic filter',
    },
    {
      id: 'cab',
      title: 'Solo Cab (Uber / Ola)',
      icon: Car,
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
      costINR: Math.round(60 + distanceKm * 24),
      carbonKg: parseFloat((distanceKm * 0.21).toFixed(2)),
      durationMins: Math.round(distanceKm * 2.4),
      moneySavedINR: 0,
      carbonSavedKg: 0,
      tag: 'High cost & emissions benchmark',
    },
  ]

  const handleSelectMode = (mode) => {
    logDailyActivity({
      category: 'transport',
      impact: mode.carbonKg,
      label: `${mode.title} (${distanceKm} km)`,
      unit: `${distanceKm} km`,
      moneySaved: mode.moneySavedINR,
    })

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#005a3c', '#c9f34a', '#38bdf8'],
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#fffdf8] rounded-3xl w-full max-w-2xl shadow-2xl border border-[#e8e4d8] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#005a3c] px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-white">
              <Navigation className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold leading-tight">Smart Commute & Cost Comparator</h2>
              <p className="text-[11px] text-emerald-200">Compare travel cost, carbon, and travel time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-emerald-200 hover:text-white p-1 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Trip Distance Selector */}
          <div className="rounded-2xl border border-[#ede9dc] bg-[#fbf9f4] p-4">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="commute-distance-slider" className="text-xs font-semibold text-[#718079] uppercase tracking-wide">
                One-Way Commute Distance
              </label>
              <span className="text-base font-bold text-[#005a3c]">{distanceKm} km</span>
            </div>
            <input
              id="commute-distance-slider"
              type="range"
              min="2"
              max="45"
              step="1"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
              className="w-full accent-[#005a3c] cursor-pointer"
            />
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[11px] text-[#718079]">Quick Presets:</span>
              {[5, 12, 18, 28].map((km) => (
                <button
                  key={km}
                  onClick={() => setDistanceKm(km)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                    distanceKm === km
                      ? 'bg-[#005a3c] text-white'
                      : 'border border-[#ded8c9] bg-white text-[#718079] hover:bg-[#f3efe4]'
                  }`}
                >
                  {km} km {km === 12 ? '(Daily Office)' : km === 28 ? '(Cross-City)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Comparison Cards */}
          <div className="space-y-3">
            {modes.map((mode) => {
              const Icon = mode.icon
              return (
                <div
                  key={mode.id}
                  className="rounded-2xl border p-4 transition-all hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{ backgroundColor: mode.bg, borderColor: mode.border }}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span
                      className="grid size-11 shrink-0 place-items-center rounded-2xl"
                      style={{ backgroundColor: `${mode.color}18`, color: mode.color }}
                    >
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm text-[#062b20]">{mode.title}</h4>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ backgroundColor: `${mode.color}20`, color: mode.color }}
                        >
                          {mode.tag}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-[#52645a]">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-[#718079]" /> ~{mode.durationMins} mins
                        </span>
                        <span>•</span>
                        <span>
                          Emits <strong>{mode.carbonKg} kg CO₂</strong>
                        </span>
                        {mode.moneySavedINR > 0 && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-[#005a3c] flex items-center gap-0.5">
                              <TrendingDown className="size-3" /> Saves ₹{mode.moneySavedINR} vs cab
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#ded8c9]/50">
                    <div className="text-right">
                      <div className="text-base font-bold text-[#062b20]">
                        {mode.costINR === 0 ? 'FREE' : `₹${mode.costINR}`}
                      </div>
                      <div className="text-[10px] text-[#718079]">est. fare</div>
                    </div>

                    <button
                      onClick={() => handleSelectMode(mode)}
                      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition active:scale-95 shadow-xs"
                      style={{ backgroundColor: mode.color }}
                    >
                      <CheckCircle2 className="size-3.5" /> Log Ride
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#ede9dc] bg-[#faf8f4] px-6 py-3.5">
          <p className="text-xs text-[#718079]">
            💡 Commuting by metro saves an average of <strong>₹8,000+</strong> and <strong>540 kg CO₂</strong> yearly!
          </p>
          <button
            onClick={onClose}
            className="rounded-xl border border-[#ded8c9] px-4 py-2 text-xs font-semibold text-[#52645a] hover:bg-[#f3efe4] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

CommuteComparatorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

