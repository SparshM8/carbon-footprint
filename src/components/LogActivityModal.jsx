import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useStore from '../store/useStore'
import confetti from 'canvas-confetti'
import {
  Camera,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  MessageSquare,
  TrendingDown,
  ArrowRight,
} from 'lucide-react'
import { scanReceiptWithGemini, SAMPLE_RECEIPTS } from '../utils/receiptScanner'
import { parseDayWithGemini } from '../utils/aiDailyAudit'

const CATEGORIES = [
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'digital', label: 'Digital', icon: '💻' },
]

const ACTIVITIES = {
  transport: [
    { id: 'metro', label: 'Metro / train commute', factor: 0.045, unit: 'km', defaultAmt: 14, defaultSavings: 240 },
    { id: 'walk', label: 'Walk / cycle (Zero emissions!)', factor: 0.0, unit: 'km', defaultAmt: 4, defaultSavings: 80 },
    { id: 'car', label: 'Car drive (solo)', factor: 0.21, unit: 'km', defaultAmt: 12, defaultSavings: 0 },
    { id: 'bus', label: 'City bus commute', factor: 0.089, unit: 'km', defaultAmt: 10, defaultSavings: 180 },
    { id: 'bike', label: 'Motorbike / scooter', factor: 0.11, unit: 'km', defaultAmt: 8, defaultSavings: 120 },
  ],
  food: [
    { id: 'veg', label: 'Vegetarian meal (dairy/paneer)', factor: 0.6, unit: 'meals', defaultAmt: 1, defaultSavings: 120 },
    { id: 'vegan', label: 'Plant-based / vegan meal', factor: 0.3, unit: 'meals', defaultAmt: 1, defaultSavings: 160 },
    { id: 'poultry', label: 'Poultry / fish meal', factor: 1.2, unit: 'meals', defaultAmt: 1, defaultSavings: 0 },
    { id: 'beef', label: 'Red meat meal (beef/mutton)', factor: 2.5, unit: 'meals', defaultAmt: 1, defaultSavings: 0 },
  ],
  energy: [
    { id: 'ac-eco', label: 'AC set to 24°C (Eco-mode)', factor: 0.35, unit: 'hours', defaultAmt: 4, defaultSavings: 90 },
    { id: 'ac', label: 'Standard AC running (18-20°C)', factor: 0.55, unit: 'hours', defaultAmt: 4, defaultSavings: 0 },
    { id: 'fan', label: 'Fan and LED lights only', factor: 0.08, unit: 'hours', defaultAmt: 6, defaultSavings: 60 },
    { id: 'appliances', label: 'Heavy appliances (washing/oven)', factor: 0.8, unit: 'uses', defaultAmt: 1, defaultSavings: 0 },
  ],
  shopping: [
    { id: 'secondhand', label: 'Thrift / second-hand item', factor: 0.5, unit: 'items', defaultAmt: 1, defaultSavings: 350 },
    { id: 'groceries', label: 'Local grocery run', factor: 0.8, unit: 'trips', defaultAmt: 1, defaultSavings: 80 },
    { id: 'clothes', label: 'New fast-fashion clothing', factor: 5.0, unit: 'items', defaultAmt: 1, defaultSavings: 0 },
    { id: 'electronics', label: 'New electronic device', factor: 15.0, unit: 'items', defaultAmt: 1, defaultSavings: 0 },
  ],
  digital: [
    { id: 'stream', label: 'HD video streaming', factor: 0.036, unit: 'hours', defaultAmt: 3, defaultSavings: 0 },
    { id: 'gaming', label: 'Cloud gaming / video calls', factor: 0.12, unit: 'hours', defaultAmt: 2, defaultSavings: 0 },
  ],
}

const NL_PRESETS = [
  'Office metro se gaya 14 km, lunch me dal chawal khaya, shaam ko 3 km walk kiya',
  'Cycled 6 km to market, bought local vegetables, zero AC today',
  'Took cab 12 km, had chicken biryani, ran AC 3 hours',
]

export default function LogActivityModal({ isOpen, onClose }) {
  const { logDailyActivity, logBatchActivities } = useStore()
  const [activeTab, setActiveTab] = useState('ai-checkin') // 'ai-checkin' | 'manual' | 'scanner'

  // AI 10-Second Check-in State
  const [nlText, setNlText] = useState('')
  const [isNlAnalyzing, setIsNlAnalyzing] = useState(false)
  const [nlResult, setNlResult] = useState(null)
  const [nlError, setNlError] = useState(null)

  // Manual Tab State
  const [selectedCat, setSelectedCat] = useState('transport')
  const [selectedActId, setSelectedActId] = useState('metro')
  const [amount, setAmount] = useState(14)

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
      moneySaved: currentActivity.defaultSavings || 0,
    })

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#005a3c', '#9ade4f', '#ffb25f'],
    })

    onClose()
  }

  const handleNlAnalyze = async () => {
    if (!nlText.trim()) return
    setIsNlAnalyzing(true)
    setNlError(null)
    setNlResult(null)

    try {
      const res = await parseDayWithGemini(nlText)
      setNlResult(res)
    } catch {
      setNlError('Failed to parse sentence. Please try again.')
    } finally {
      setIsNlAnalyzing(false)
    }
  }

  const handleConfirmNlBatch = () => {
    if (!nlResult?.items?.length) return
    logBatchActivities(nlResult.items)

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#005a3c', '#c9f34a', '#38bdf8'],
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
      moneySaved: scanResult.category === 'energy' ? 120 : scanResult.category === 'food' ? 80 : 0,
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
      <div className="bg-[#fffdf8] rounded-3xl w-full max-w-xl shadow-2xl border border-[#e8e4d8] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#005a3c] px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <div>
              <h2 className="text-base font-semibold leading-tight">Log Carbon Impact & Savings</h2>
              <p className="text-[11px] text-emerald-200">Zero friction: Type naturally, pick presets, or scan bills</p>
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

        {/* 3 Tabs */}
        <div className="flex border-b border-[#ede9dc] bg-[#f7f5ed] px-6 pt-3 gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ai-checkin')}
            className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-semibold whitespace-nowrap transition border-b-2 ${
              activeTab === 'ai-checkin'
                ? 'border-[#005a3c] text-[#005a3c]'
                : 'border-transparent text-[#718079] hover:text-[#062b20]'
            }`}
          >
            <MessageSquare className="size-3.5" /> 🎙️ 10s AI Check-in
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-semibold whitespace-nowrap transition border-b-2 ${
              activeTab === 'manual'
                ? 'border-[#005a3c] text-[#005a3c]'
                : 'border-transparent text-[#718079] hover:text-[#062b20]'
            }`}
          >
            <Zap className="size-3.5" /> Quick Preset
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-semibold whitespace-nowrap transition border-b-2 ${
              activeTab === 'scanner'
                ? 'border-[#005a3c] text-[#005a3c]'
                : 'border-transparent text-[#718079] hover:text-[#062b20]'
            }`}
          >
            <Camera className="size-3.5" /> 📸 Receipt Scanner
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: 10-Second Natural Language AI Check-in */}
          {activeTab === 'ai-checkin' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#f0f9f3] border border-[#d2ecdc] p-4 text-xs text-[#1e503b] flex gap-3">
                <Sparkles className="size-5 shrink-0 text-[#005a3c] mt-0.5" />
                <div>
                  <strong className="block font-semibold">Gemini Flash 3.8 Natural Language Check-in</strong>
                  Just type or speak how your day went in Hindi, Hinglish, or English. Gemini automatically extracts activities, carbon footprint, and money saved in ₹!
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#718079] uppercase tracking-wide block mb-1.5">
                  Describe your day in 1 sentence
                </label>
                <textarea
                  rows={3}
                  value={nlText}
                  onChange={(e) => setNlText(e.target.value)}
                  placeholder="e.g. Office metro se gaya 14 km, lunch me dal chawal khaya, shaam ko 3 km walk kiya"
                  className="w-full px-4 py-3 text-sm border border-[#ede9dc] rounded-2xl bg-white text-[#062b20] focus:outline-none focus:ring-2 focus:ring-[#005a3c]"
                />
              </div>

              {/* Quick Prompt Presets */}
              <div>
                <span className="text-[11px] text-[#718079] block mb-1.5">Or try a sample prompt:</span>
                <div className="flex flex-col gap-1.5">
                  {NL_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNlText(preset)}
                      className="text-left text-xs text-[#52645a] bg-[#fbf9f4] hover:bg-[#f3efe4] border border-[#ede9dc] p-2.5 rounded-xl transition line-clamp-1"
                    >
                      💬 &quot;{preset}&quot;
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNlAnalyze}
                disabled={isNlAnalyzing || !nlText.trim()}
                className="w-full py-3 rounded-xl bg-[#005a3c] hover:bg-[#00452f] disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >
                {isNlAnalyzing ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Gemini is extracting carbon & money savings...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 text-[#c9f34a]" />
                    <span>Extract with Gemini Flash 3.8</span>
                  </>
                )}
              </button>

              {nlError && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{nlError}</span>
                </div>
              )}

              {/* Extracted Batch Preview */}
              {nlResult && (
                <div className="rounded-2xl border border-[#cfe9d5] bg-[#f2f9f3] p-4 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#daeee0] pb-2">
                    <span className="text-xs font-bold text-[#005a3c] flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-[#005a3c]" /> AI Analysis Complete
                    </span>
                    <span className="text-[10px] bg-[#005a3c]/10 text-[#005a3c] px-2 py-0.5 rounded-full font-semibold">
                      {nlResult.model}
                    </span>
                  </div>

                  <p className="text-xs text-[#1e503b] font-medium leading-relaxed">
                    {nlResult.summary}
                  </p>

                  {/* High level metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white/80 p-2.5 border border-[#e1f0e5]">
                      <span className="text-[10px] text-[#718079] block">Total Carbon</span>
                      <strong className="text-sm text-[#062b20]">+{nlResult.totalImpactKg} kg CO₂</strong>
                    </div>
                    <div className="rounded-xl bg-white/80 p-2.5 border border-[#e1f0e5]">
                      <span className="text-[10px] text-[#718079] block">Pocket Money Saved</span>
                      <strong className="text-sm text-[#005a3c] flex items-center gap-0.5">
                        <TrendingDown className="size-3.5" /> ₹{nlResult.totalMoneySavedINR}
                      </strong>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1.5">
                    {nlResult.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/60 text-xs border border-[#e8f2ea]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-[#005a3c]" />
                          <span className="font-semibold text-[#062b20]">{item.title}</span>
                          <span className="text-[10px] text-[#718079]">({item.unit})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.moneySaved > 0 && (
                            <span className="text-[10px] bg-[#d5f3df] text-[#005a3c] px-2 py-0.5 rounded-md font-semibold">
                              Saved ₹{item.moneySaved}
                            </span>
                          )}
                          <span className="font-bold text-[#b45309]">+{item.impact} kg</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirmNlBatch}
                    className="w-full py-2.5 rounded-xl bg-[#005a3c] hover:bg-[#00452f] text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="size-4 text-[#c9f34a]" />
                    <span>Confirm & Log All to Today (+{Math.max(30, (nlResult.items?.length || 1) * 20)} XP)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Manual Preset */}
          {activeTab === 'manual' && (
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
                      <div>
                        <span className="text-xs font-medium block">{act.label}</span>
                        {act.defaultSavings > 0 && (
                          <span className="text-[10px] font-semibold text-[#005a3c] inline-flex items-center gap-0.5">
                            💰 Saves ~₹{act.defaultSavings}
                          </span>
                        )}
                      </div>
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

              <div className="pt-2 flex gap-2">
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
            </>
          )}

          {/* TAB 3: Receipt Scanner */}
          {activeTab === 'scanner' && (
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
      </div>
    </div>
  )
}

LogActivityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
