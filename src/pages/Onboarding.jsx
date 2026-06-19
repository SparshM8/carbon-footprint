import React, { useState } from 'react'
import useStore from '../store/useStore'

const TRANSPORT_OPTIONS = [
  { id: 'car', label: 'Car', icon: '🚗', factor: 4.2 },
  { id: 'bus', label: 'Bus', icon: '🚌', factor: 1.8 },
  { id: 'bike', label: 'Motorbike', icon: '🏍️', factor: 2.1 },
  { id: 'cycle', label: 'Cycle/Walk', icon: '🚲', factor: 0.1 },
  { id: 'wfh', label: 'Work from Home', icon: '🏠', factor: 0.3 },
]

const DIET_OPTIONS = [
  { id: 'non-veg', label: 'Non-vegetarian', icon: '🍖', factor: 3.3 },
  { id: 'veg', label: 'Vegetarian', icon: '🥗', factor: 1.7 },
  { id: 'vegan', label: 'Vegan', icon: '🌱', factor: 1.1 },
]

const HOME_OPTIONS = [
  { id: 'apartment-ac', label: 'Apartment with AC', icon: '🏢', factor: 2.4 },
  { id: 'apartment-no-ac', label: 'Apartment, no AC', icon: '🏠', factor: 1.2 },
  { id: 'house-ac', label: 'House with AC', icon: '🏡', factor: 3.1 },
  { id: 'house-no-ac', label: 'House, no AC', icon: '🏘️', factor: 1.6 },
]

const STEPS = ['Profile', 'Lifestyle', 'Home & Energy']

export default function Onboarding() {
  const { completeOnboarding } = useStore()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    transport: null,
    kmPerDay: 15,
    diet: null,
    home: null,
    shopping: 'moderate',
  })

  const update = (key, val) => setData(d => ({ ...d, [key]: val }))

  const canNext = () => {
    if (step === 0) return data.name.trim().length > 1
    if (step === 1) return data.transport && data.diet
    if (step === 2) return data.home
    return true
  }

  const handleFinish = () => {
    const transportObj = TRANSPORT_OPTIONS.find(t => t.id === data.transport)
    const dietObj = DIET_OPTIONS.find(d => d.id === data.diet)
    const homeObj = HOME_OPTIONS.find(h => h.id === data.home)
    const shoppingFactor = data.shopping === 'low' ? 0.6 : data.shopping === 'moderate' ? 1.1 : 1.8

    const footprint = {
      transport: parseFloat(((transportObj?.factor || 2) * (data.kmPerDay / 20)).toFixed(1)),
      food: parseFloat((dietObj?.factor || 2).toFixed(1)),
      energy: parseFloat((homeObj?.factor || 1.5).toFixed(1)),
      shopping: parseFloat(shoppingFactor.toFixed(1)),
      digital: 0.3,
    }

    completeOnboarding({ name: data.name, footprint })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-900 to-forest-700 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-14 pb-8 px-6 text-center">
        <div className="text-5xl mb-3">🌱</div>
        <h1 className="text-2xl font-semibold text-white">EcoSelf</h1>
        <p className="text-forest-300 text-sm mt-1">Your personal carbon footprint companion</p>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              i < step ? 'bg-forest-400 text-white' : i === step ? 'bg-white text-forest-800' : 'bg-forest-700 text-forest-400'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${i < step ? 'bg-forest-400' : 'bg-forest-700'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-7 pb-8 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{STEPS[step]}</h2>

        {/* Step 0: Profile */}
        {step === 0 && (
          <div className="space-y-4 mt-4">
            <p className="text-sm text-gray-500">Let's get started. What's your name?</p>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5" htmlFor="name-input">Your name</label>
              <input
                id="name-input"
                type="text"
                value={data.name}
                onChange={e => update('name', e.target.value)}
                placeholder="e.g. Alex"
                autoFocus
                className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="bg-forest-50 border border-forest-100 rounded-xl p-4 mt-4">
              <p className="text-xs text-forest-700 leading-relaxed">
                🌍 The average Indian emits <strong>5.2 kg CO₂ per day</strong>. The 1.5°C climate target requires us to get below <strong>4 kg</strong>. EcoSelf helps you get there — step by step.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Lifestyle */}
        {step === 1 && (
          <div className="space-y-5 mt-4">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">How do you usually commute?</p>
              <div className="grid grid-cols-2 gap-2">
                {TRANSPORT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => update('transport', opt.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      data.transport === opt.id
                        ? 'border-forest-500 bg-forest-50 text-forest-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {data.transport && data.transport !== 'wfh' && data.transport !== 'cycle' && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Daily km travelled: <strong>{data.kmPerDay} km</strong></p>
                <input
                  type="range" min="1" max="100" value={data.kmPerDay}
                  onChange={e => update('kmPerDay', +e.target.value)}
                  className="w-full"
                  aria-label="Daily km"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1 km</span><span>100 km</span>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">What's your diet like?</p>
              <div className="space-y-2">
                {DIET_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => update('diet', opt.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      data.diet === opt.id
                        ? 'border-forest-500 bg-forest-50 text-forest-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <div className="text-xs font-medium">{opt.label}</div>
                      <div className="text-[10px] text-gray-400">~{opt.factor} kg CO₂/day</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Home */}
        {step === 2 && (
          <div className="space-y-5 mt-4">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">What type of home do you live in?</p>
              <div className="space-y-2">
                {HOME_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => update('home', opt.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      data.home === opt.id
                        ? 'border-forest-500 bg-forest-50 text-forest-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <div className="text-xs font-medium">{opt.label}</div>
                      <div className="text-[10px] text-gray-400">~{opt.factor} kg CO₂/day</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">How often do you shop for new things?</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Rarely', icon: '😌' },
                  { id: 'moderate', label: 'Sometimes', icon: '🛍️' },
                  { id: 'high', label: 'Often', icon: '🛒' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => update('shopping', opt.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                      data.shopping === opt.id
                        ? 'border-forest-500 bg-forest-50 text-forest-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => step < 2 ? setStep(s => s + 1) : handleFinish()}
            disabled={!canNext()}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
              canNext()
                ? 'bg-forest-600 text-white hover:bg-forest-700 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step < 2 ? 'Continue →' : 'Start tracking 🌱'}
          </button>
        </div>
      </div>
    </div>
  )
}
