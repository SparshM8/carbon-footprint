import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useStore from '../store/useStore'
import { getTotalKg, GLOBAL_AVERAGE } from '../utils/calculations'
import { Share2, Check, Copy, X, Sparkles, Trees, Award } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function ShareImpactModal({ isOpen, onClose }) {
  const { user, footprint } = useStore()
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const total = getTotalKg(footprint)
  const reductionPct = Math.max(0, Math.round(((GLOBAL_AVERAGE - total) / GLOBAL_AVERAGE) * 100))
  const treesEquivalent = (Math.max(0.5, (GLOBAL_AVERAGE - total) * 365 / 22)).toFixed(1)

  const shareText = `🌱 I'm tracking my carbon footprint with Carbonly!\n\n` +
    `⚡ My footprint: ${total} kg CO₂/day (${reductionPct}% lower than global avg)\n` +
    `🔥 Current streak: ${user?.streak || 1} days\n` +
    `🌳 Impact: Saving ~${treesEquivalent} trees per year\n\n` +
    `Take small steps for the planet with me: https://carbonly.app`

  const handleCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText)
    }
    setCopied(true)
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#005a3c', '#9ade4f', '#ffb25f'],
    })
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#e8e4d8] bg-[#fffdf8] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0ece1] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-[#d5f3df] text-[#005a3c]">
              <Share2 className="size-4" />
            </span>
            <h3 className="font-semibold text-[#062b20]">Share Your Impact</h3>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-[#718079] hover:bg-[#f0ece1] hover:text-[#062b20] transition"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="p-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#005a3c] via-[#06422d] to-[#04281b] p-6 text-white shadow-xl">
            {/* Background Leaf Pattern Accent */}
            <div className="absolute -right-6 -bottom-6 size-40 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute top-0 right-0 p-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-emerald-200 backdrop-blur-xs">
                <Sparkles className="size-3 text-[#c9f34a]" /> Verified Impact
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-white/10 text-xl font-bold ring-2 ring-white/20">
                {user?.name?.[0]?.toUpperCase() || 'E'}
              </div>
              <div>
                <h4 className="font-semibold text-lg leading-tight">{user?.name || 'Eco Champion'}</h4>
                <p className="text-xs text-emerald-200">{user?.city || 'Planet Earth'} · Level {Math.floor((user?.xp || 0) / 100) + 1}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs">
                <p className="text-[11px] text-emerald-200">Daily Footprint</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white">{total} <span className="text-xs font-normal text-emerald-300">kg CO₂</span></p>
                <p className="mt-0.5 text-[10px] text-[#c9f34a]">↓ {reductionPct}% vs global avg</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs">
                <p className="text-[11px] text-emerald-200">Yearly Savings</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <Trees className="size-4 text-[#c9f34a]" />
                  <p className="text-2xl font-bold tracking-tight text-white">~{treesEquivalent}</p>
                </div>
                <p className="mt-0.5 text-[10px] text-emerald-200">trees equivalent</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-emerald-200">
              <span className="flex items-center gap-1.5">
                <Award className="size-3.5 text-[#c9f34a]" /> {user?.streak || 1}-day active streak
              </span>
              <span className="font-serif italic text-white/80">carbonly.app</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-[#718079] text-center">
            Copy text to share on Twitter/X, LinkedIn, or WhatsApp status to inspire your circle!
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 border-t border-[#f0ece1] bg-[#faf8f4] px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#ded8c9] py-2.5 text-xs font-semibold text-[#52645a] hover:bg-[#f3efe4] transition"
          >
            Done
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#005a3c] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#00452f] active:scale-95 transition"
          >
            {copied ? <Check className="size-4 text-[#c9f34a]" /> : <Copy className="size-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Share Text'}
          </button>
        </div>
      </div>
    </div>
  )
}

ShareImpactModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
