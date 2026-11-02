import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useStore from '../store/useStore'
import confetti from 'canvas-confetti'

const CATEGORIES = [
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'digital', label: 'Digital', icon: '💻' },
]

const ACTIVITIES = {
  transport: [
    { id: 'car', label: 'Car drive (solo)', factor: 0.21, unit: 'km', defaultAmt: 10 },
    { id: 'bus', label: 'Bus commute', factor: 0.089, unit: 'km', defaultAmt: 10 },
    { id: 'metro', label: 'Metro / train', factor: 0.045, unit: 'km', defaultAmt: 12 },
    { id: 'bike', label: 'Motorbike / scooter', factor: 0.11, unit: 'km', defaultAmt: 8 },
    { id: 'walk', label: 'Walk / cycle (Zero emissions!)', factor: 0.0, unit: 'km', defaultAmt: 3 },
  ],
  food: [
    { id: 'beef', label: 'Red meat meal (beef/mutton)', factor: 2.5, unit: 'meals', defaultAmt: 1 },
    { id: 'poultry', label: 'Poultry / fish meal', factor: 1.2, unit: 'meals', defaultAmt: 1 },
    { id: 'veg', label: 'Vegetarian meal (dairy/paneer)', factor: 0.6, unit: 'meals', defaultAmt: 1 },
    { id: 'vegan', label: 'Plant-based / vegan meal', factor: 0.3, unit: 'meals', defaultAmt: 1 },
  ],
  energy: [
    { id: 'ac', label: 'Air conditioning running', factor: 0.45, unit: 'hours', defaultAmt: 4 },
    { id: 'appliances', label: 'Heavy appliances (washing/oven)', factor: 0.8, unit: 'uses', defaultAmt: 1 },
    { id: 'fan', label: 'Fan and LED lights only', factor: 0.08, unit: 'hours', defaultAmt: 6 },
  ],
  shopping: [
    { id: 'clothes', label: 'New fast-fashion clothing', factor: 5.0, unit: 'items', defaultAmt: 1 },
    { id: 'electronics', label: 'New electronic device', factor: 15.0, unit: 'items', defaultAmt: 1 },
    { id: 'secondhand', label: 'Thrift / second-hand item', factor: 0.5, unit: 'items', defaultAmt: 1 },
    { id: 'groceries', label: 'Local grocery run', factor: 0.8, unit: 'trips', defaultAmt: 1 },
  ],
  digital: [
    { id: 'stream', label: 'HD video streaming', factor: 0.036, unit: 'hours', defaultAmt: 3 },
    { id: 'gaming', label: 'Cloud gaming / video calls', factor: 0.12, unit: 'hours', defaultAmt: 2 },
  ],
}

export default function LogActivityModal({ isOpen, onClose }) {
  const { logDailyActivity } = useStore()
  const [selectedCat, setSelectedCat] = useState('transport')
  const [selectedActId, setSelectedActId] = useState('car')
  const [amount, setAmount] = useState(10)

  if (!isOpen) return null

  const activityOptions = ACTIVITIES[selectedCat] || []
  const currentActivity = activityOptions.find(a => a.id === selectedActId) || activityOptions[0]
  const calculatedImpact = parseFloat(((currentActivity?.factor || 0) * (amount || 0)).toFixed(2))

  const handleSelectCat = (catId) => {
    setSelectedCat(catId)
    const firstAct = ACTIVITIES[catId]?.[0]
    if (firstAct) {
      setSelectedActId(firstAct.id)
      setAmount(firstAct.defaultAmt)
    }
  }

  const handleSelectAct = (act) => {
    setSelectedActId(act.id)
    setAmount(act.defaultAmt)
  }

  const handleSave = () => {
    logDailyActivity({
      category: selectedCat,
      impact: calculatedImpact,
      label: currentActivity.label,
    })

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#16a34a', '#22c55e', '#a7f3d0'],
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-forest-900 to-forest-800 px-5 py-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h2 className="text-base font-semibold">Log Today&apos;s Activity</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-forest-300 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Category Tabs */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Category</label>
            <div className="grid grid-cols-5 gap-1.5 bg-gray-100 p-1 rounded-xl">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCat(cat.id)}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-all ${
                    selectedCat === cat.id
                      ? 'bg-white font-medium text-forest-800 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-[10px] mt-0.5">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Selection */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Specific Action</label>
            <div className="space-y-1.5">
              {activityOptions.map(act => (
                <button
                  key={act.id}
                  onClick={() => handleSelectAct(act)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    selectedActId === act.id
                      ? 'border-forest-500 bg-forest-50/70 text-forest-900 ring-1 ring-forest-500'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-medium">{act.label}</span>
                  <span className="text-[11px] text-gray-400">~{act.factor} kg / {act.unit}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="amount-input" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Quantity ({currentActivity?.unit})
              </label>
              <span className="text-xs font-semibold text-forest-800">{amount} {currentActivity?.unit}</span>
            </div>
            <input
              id="amount-input"
              type="number"
              min="0"
              max="500"
              step="any"
              value={amount}
              onChange={e => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          {/* Impact preview */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex justify-between items-center">
            <div>
              <div className="text-xs text-emerald-800 font-medium">Estimated Emissions</div>
              <div className="text-[10px] text-emerald-600">Added to today&apos;s footprint</div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-emerald-800">+{calculatedImpact}</span>
              <span className="text-xs text-emerald-700 ml-1">kg CO₂</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm"
          >
            Log Activity (+{Math.max(15, Math.round(calculatedImpact * 10))} XP)
          </button>
        </div>
      </div>
    </div>
  )
}

LogActivityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

