import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useStore from '../store/useStore'
import confetti from 'canvas-confetti'
import { Camera, Zap, FileText, CheckCircle2, Sparkles, AlertCircle, RefreshCw, X } from 'lucide-react'
import { scanReceiptWithGemini, SAMPLE_RECEIPTS } from '../utils/receiptScanner'

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
  const [activeTab, setActiveTab] = useState('manual') // 'manual' | 'scanner'

  // Manual Tab State
  const [selectedCat, setSelectedCat] = useState('transport')
  const [selectedActId, setSelectedActId] = useState('car')
  const [amount, setAmount] = useState(10)

  // Scanner Tab State
  const [selectedSample, setSelectedSample] = useState(SAMPLE_RECEIPTS[0].id)
  const [customReceiptText, setCustomReceiptText] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanError, setScanError] = useState(null)

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

  const handleManualSave = () => {
    logDailyActivity({
      category: selectedCat,
      impact: calculatedImpact,
      label: currentActivity.label,
      unit: `${amount} ${currentActivity.unit}`,
    })

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#005a3c', '#9ade4f', '#ffb25f'],
    })

    onClose()
  }

  const handleScanReceipt = async () => {
    setIsScanning(true)
    setScanError(null)
    setScanResult(null)

    try {
      const result = await scanReceiptWithGemini({
        receiptId: customReceiptText ? null : selectedSample,
        customText: customReceiptText || null,
      })
      setScanResult(result)
    } catch {
      setScanError('Failed to parse receipt. Please verify details and try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleConfirmScanResult = () => {
    if (!scanResult) return

    logDailyActivity({
      category: scanResult.category || 'shopping',
      impact: parseFloat(scanResult.impact) || 1.0,
      label: `${scanResult.vendor} (${scanResult.unit})`,
      unit: scanResult.unit,
      receiptScan: true,
    })

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#005a3c', '#c9f34a', '#38bdf8'],
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#fffdf8] rounded-3xl w-full max-w-lg shadow-2xl border border-[#e8e4d8] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#005a3c] px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <div>
              <h2 className="text-base font-semibold leading-tight">Log Carbon Impact</h2>
              <p className="text-[11px] text-emerald-200">Track habits or scan bills to calculate CO₂</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-emerald-200 hover:text-white text-lg p-1 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#ede9dc] bg-[#f7f5ed] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
              activeTab === 'manual'
                ? 'border-[#005a3c] text-[#005a3c]'
                : 'border-transparent text-[#718079] hover:text-[#062b20]'
            }`}
          >
            <Zap className="size-3.5" /> Quick Activity Log
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
              activeTab === 'scanner'
                ? 'border-[#005a3c] text-[#005a3c]'
                : 'border-transparent text-[#718079] hover:text-[#062b20]'
            }`}
          >
            <Camera className="size-3.5" /> 📸 Gemini Receipt / Bill Scanner
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {activeTab === 'manual' ? (
            <>
              {/* Category Tabs */}
              <div>
                <label className="text-xs font-semibold text-[#718079] uppercase tracking-wide block mb-2">
                  Category
                </label>
                <div className="grid grid-cols-5 gap-1.5 bg-[#f0ede2] p-1.5 rounded-2xl">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCat(cat.id)}
                      className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs transition-all ${
                        selectedCat === cat.id
                          ? 'bg-[#fffdf8] font-semibold text-[#005a3c] shadow-xs'
                          : 'text-[#63736a] hover:text-[#062b20]'
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
                <label className="text-xs font-semibold text-[#718079] uppercase tracking-wide block mb-2">
                  Specific Action
                </label>
                <div className="space-y-1.5">
                  {activityOptions.map(act => (
                    <button
                      key={act.id}
                      onClick={() => handleSelectAct(act)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        selectedActId === act.id
                          ? 'border-[#005a3c] bg-[#f2f8f4] text-[#062b20] ring-1 ring-[#005a3c]'
                          : 'border-[#ede9dc] bg-[#fffdf8] text-[#2c3d35] hover:border-[#ded8c9]'
                      }`}
                    >
                      <span className="text-xs font-medium">{act.label}</span>
                      <span className="text-[11px] text-[#718079]">~{act.factor} kg / {act.unit}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="amount-input" className="text-xs font-semibold text-[#718079] uppercase tracking-wide">
                    Quantity ({currentActivity?.unit})
                  </label>
                  <span className="text-xs font-bold text-[#005a3c]">{amount} {currentActivity?.unit}</span>
                </div>
                <input
                  id="amount-input"
                  type="number"
                  min="0"
                  max="500"
                  step="any"
                  value={amount}
                  onChange={e => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 border border-[#ede9dc] rounded-xl text-sm bg-white text-[#062b20] focus:outline-none focus:ring-2 focus:ring-[#005a3c]"
                />
              </div>

              {/* Impact preview */}
              <div className="bg-[#f0f9f3] border border-[#d2ecdc] rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="text-xs text-[#005a3c] font-semibold">Estimated Daily Emissions</div>
                  <div className="text-[10px] text-[#527b68]">Calculated in real-time</div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#005a3c]">+{calculatedImpact}</span>
                  <span className="text-xs text-[#005a3c]/80 ml-1">kg CO₂</span>
                </div>
              </div>
            </>
          ) : (
            /* Gemini Receipt Scanner Tab */
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#f0f9f3] border border-[#d2ecdc] p-4 text-xs text-[#1e503b] flex gap-3">
                <Sparkles className="size-5 shrink-0 text-[#005a3c] mt-0.5" />
                <div>
                  <strong className="block font-semibold">Gemini Flash 3.8 AI Receipt Extractor</strong>
                  Select a sample utility bill / receipt or paste invoice text to automatically compute CO₂ emissions and money-saving reduction tips.
                </div>
              </div>

              {/* Sample Receipts Grid */}
              <div>
                <label className="text-xs font-semibold text-[#718079] uppercase tracking-wide block mb-2">
                  Select a Sample Bill / Receipt to Scan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_RECEIPTS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSample(s.id)
                        setCustomReceiptText('')
                      }}
                      className={`p-3 rounded-2xl border text-left transition ${
                        selectedSample === s.id && !customReceiptText
                          ? 'border-[#005a3c] bg-[#f0f9f3] ring-1 ring-[#005a3c]'
                          : 'border-[#ede9dc] bg-[#fffdf8] hover:border-[#ded8c9]'
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#062b20]">{s.name}</p>
                      <p className="text-[10px] text-[#718079] mt-1 line-clamp-1">{s.snippet}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Text or File Input */}
              <div>
                <label className="text-xs font-semibold text-[#718079] uppercase tracking-wide block mb-1.5">
                  Or Paste Custom Receipt / Bill Text
                </label>
                <textarea
                  rows={2}
                  value={customReceiptText}
                  onChange={(e) => setCustomReceiptText(e.target.value)}
                  placeholder="e.g. Swiggy order #4819: 1 Chicken Biryani + Soda, total ₹380, delivery 4 km"
                  className="w-full px-3 py-2 text-xs border border-[#ede9dc] rounded-xl bg-white text-[#062b20] focus:outline-none focus:ring-2 focus:ring-[#005a3c]"
                />
              </div>

              {/* Scan Trigger Button */}
              <button
                onClick={handleScanReceipt}
                disabled={isScanning}
                className="w-full py-3 rounded-xl bg-[#005a3c] hover:bg-[#00452f] disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Gemini Flash is analyzing receipt...</span>
                  </>
                ) : (
                  <>
                    <Camera className="size-4" />
                    <span>Analyze with Gemini Flash 3.8</span>
                  </>
                )}
              </button>

              {/* Scan Error */}
              {scanError && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{scanError}</span>
                </div>
              )}

              {/* Scan Result Card */}
              {scanResult && (
                <div className="rounded-2xl border border-[#cfe9d5] bg-[#f2f9f3] p-4 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#daeee0] pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#005a3c]">
                      <CheckCircle2 className="size-4 text-[#005a3c]" />
                      <span>{scanResult.vendor}</span>
                    </div>
                    <span className="text-[10px] font-semibold bg-[#005a3c]/10 text-[#005a3c] px-2 py-0.5 rounded-full">
                      {scanResult.confidence}% Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white/70 p-2.5 border border-[#e1f0e5]">
                      <span className="text-[10px] text-[#718079] block">Category</span>
                      <strong className="text-[#062b20] capitalize">{scanResult.category}</strong>
                    </div>
                    <div className="rounded-xl bg-white/70 p-2.5 border border-[#e1f0e5]">
                      <span className="text-[10px] text-[#718079] block">Computed CO₂</span>
                      <strong className="text-[#005a3c] text-sm">+{scanResult.impact} kg</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#526d5f] leading-relaxed">
                    {scanResult.explanation}
                  </p>

                  <div className="rounded-xl bg-amber-50 border border-amber-200/70 p-2.5 text-[11px] text-amber-900 flex gap-2">
                    <span className="text-sm">💡</span>
                    <div>
                      <strong className="font-semibold block">Gemini Savings Tip:</strong>
                      {scanResult.savingsTip}
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmScanResult}
                    className="w-full py-2.5 rounded-xl bg-[#005a3c] hover:bg-[#00452f] text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="size-4 text-[#c9f34a]" />
                    <span>Confirm & Add to Activity Log</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Manual Tab Footer */}
        {activeTab === 'manual' && (
          <div className="p-4 bg-[#f8f6ef] border-t border-[#ede9dc] flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#ded8c9] text-[#52645a] text-xs font-semibold hover:bg-[#f3efe4] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleManualSave}
              className="flex-1 py-2.5 rounded-xl bg-[#005a3c] hover:bg-[#00452f] active:scale-95 text-white text-xs font-semibold transition-all shadow-sm"
            >
              Log Activity (+{Math.max(15, Math.round(calculatedImpact * 10))} XP)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

LogActivityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
