import React, { useState, useEffect } from 'react'
import useStore from '../store/useStore'
import WorldScene from '../components/WorldScene'
import ShareImpactModal from '../components/ShareImpactModal'
import { getWorldHealth, getTotalKg, SUSTAINABLE_TARGET } from '../utils/calculations'
import { Leaf, Sun, Waves, Trees, Sparkles, Award, Volume2, VolumeX, Moon, Sunset, Share2 } from 'lucide-react'
import { startNatureSound, stopNatureSound } from '../utils/natureAudio'

export default function WorldView() {
  const { footprint, user, achievements } = useStore()
  const [timeOfDay, setTimeOfDay] = useState('day') // 'day' | 'sunset' | 'night'
  const [soundPlaying, setSoundPlaying] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const health = getWorldHealth(footprint, user?.streak || 0)
  const total = getTotalKg(footprint)

  useEffect(() => {
    return () => {
      stopNatureSound()
    }
  }, [])

  const toggleSound = () => {
    if (soundPlaying) {
      stopNatureSound()
      setSoundPlaying(false)
    } else {
      const started = startNatureSound()
      if (started) {
        setSoundPlaying(true)
      }
    }
  }

  const healthLabel = health >= 75
    ? { label: 'Thriving', color: '#005a3c', bg: '#d5f3df', icon: '🌿' }
    : health >= 50
    ? { label: 'Recovering', color: '#b45309', bg: '#fef3c7', icon: '🌱' }
    : health >= 25
    ? { label: 'Stressed', color: '#c2410c', bg: '#ffedd5', icon: '🍂' }
    : { label: 'Critical', color: '#b91c1c', bg: '#fee2e2', icon: '🥀' }

  const worldEvents = [
    health > 60 && {
      id: 'trees-sprouted',
      icon: '🌳',
      color: '#005a3c',
      title: `${Math.max(2, Math.round((health / 100) * 11))} flourishing trees`,
      msg: 'Your consistent carbon reduction allowed new trees to take root across the hills.'
    },
    health > 50 && {
      id: 'sky-clearing',
      icon: '☀️',
      color: '#d97706',
      title: 'Clear sunny sky',
      msg: 'Lower travel emissions removed air pollution and haze over the valley.'
    },
    total <= SUSTAINABLE_TARGET && {
      id: 'sustainable-target',
      icon: '🌊',
      color: '#0284c7',
      title: 'River in full flow',
      msg: `Your daily impact (${total} kg) is below the 1.5°C target of 4.0 kg. The river is pure and clear.`
    },
    total > 8 && {
      id: 'river-dropping',
      icon: '🌊',
      color: '#ef4444',
      title: 'River under strain',
      msg: 'Higher consumption is straining the river basin. Try completing a challenge today.'
    },
    health <= 50 && {
      id: 'forest-thinning',
      icon: '🍂',
      color: '#ea580c',
      title: 'Forest needs support',
      msg: 'Ecosystem health is recovering. Log 2 green actions today to plant more trees.'
    },
    (user?.streak || 0) >= 7 && {
      id: 'streak-bonus',
      icon: '🔥',
      color: '#f59e0b',
      title: `${user.streak}-day streak bonus!`,
      msg: `Your consistency earned a +${Math.min(user.streak * 2, 20)}% health boost for this world.`
    },
  ].filter(Boolean).slice(0, 3)

  return (
    <div className="min-h-screen pb-12">
      {/* Header matching Carbonly theme */}
      <header className="flex flex-col gap-3 pt-4 md:pt-8 mb-6">
        <p className="flex items-center gap-2 text-sm font-medium text-[#005a3c]">
          <span className="size-2 rounded-full bg-[#005a3c]" /> Dynamic visual ecosystem
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[#062b20] md:text-5xl">
              Your choices shape this <em className="font-serif text-[#005a3c]">living world.</em>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6f7f78] md:text-base">
              An interactive, living reflection of your carbon habits. As your daily footprint drops and your streak grows, this ecosystem transforms with lush trees, clean skies, and flowing waters.
            </p>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#ded8c9] bg-[#fffdf8] px-4 py-2.5 text-xs font-semibold text-[#005a3c] shadow-xs hover:bg-[#f3efe4] transition self-start md:self-auto"
          >
            <Share2 className="size-3.5" /> Share My World
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
        {/* Left Column: Interactive World Scene */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-5 shadow-sm">
            {/* Top Scene Bar with Time-of-Day & Audio Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌍</span>
                <span className="font-semibold text-sm text-[#062b20]">Interactive Valley</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1"
                  style={{ background: healthLabel.bg, color: healthLabel.color }}
                >
                  <span>{healthLabel.icon}</span> {healthLabel.label}
                </span>
              </div>

              {/* Time of Day & Audio Controls */}
              <div className="flex items-center gap-2">
                {/* Time Segmented Control */}
                <div className="flex items-center bg-[#f0ede2] p-1 rounded-full text-xs">
                  <button
                    onClick={() => setTimeOfDay('day')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition ${
                      timeOfDay === 'day'
                        ? 'bg-white text-[#005a3c] shadow-xs font-semibold'
                        : 'text-[#718079] hover:text-[#062b20]'
                    }`}
                  >
                    <Sun className="size-3" /> Day
                  </button>
                  <button
                    onClick={() => setTimeOfDay('sunset')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition ${
                      timeOfDay === 'sunset'
                        ? 'bg-white text-[#ea580c] shadow-xs font-semibold'
                        : 'text-[#718079] hover:text-[#062b20]'
                    }`}
                  >
                    <Sunset className="size-3" /> Sunset
                  </button>
                  <button
                    onClick={() => setTimeOfDay('night')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition ${
                      timeOfDay === 'night'
                        ? 'bg-white text-[#38bdf8] shadow-xs font-semibold'
                        : 'text-[#718079] hover:text-[#062b20]'
                    }`}
                  >
                    <Moon className="size-3" /> Night
                  </button>
                </div>

                {/* Ambient Nature Sound Toggle */}
                <button
                  onClick={toggleSound}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    soundPlaying
                      ? 'border-[#005a3c] bg-[#eafbba] text-[#005a3c]'
                      : 'border-[#ded8c9] bg-[#fffdf8] text-[#718079] hover:bg-[#f3efe4]'
                  }`}
                  title={soundPlaying ? 'Mute ambient nature sound' : 'Play ambient nature sound'}
                >
                  {soundPlaying ? <Volume2 className="size-3.5 text-[#005a3c]" /> : <VolumeX className="size-3.5" />}
                  <span>{soundPlaying ? 'Sound On' : 'Nature Sound'}</span>
                </button>
              </div>
            </div>

            {/* The SVG Illustration */}
            <WorldScene footprint={footprint} streak={user?.streak || 0} timeOfDay={timeOfDay} />

            {/* Health Meter & Explanation */}
            <div className="mt-5 pt-4 border-t border-[#f0ece1]">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-xs text-[#718079]">Ecosystem Health Index</p>
                  <p className="text-2xl font-bold text-[#062b20] mt-0.5">
                    {health}<span className="text-sm font-normal text-[#89958f]"> / 100</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-[#005a3c]">
                    {health >= 75 ? 'Optimal Climate Balance' : `${100 - health}% from Full Bloom`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full rounded-full bg-[#ede8dc] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${health}%`, background: health >= 75 ? '#005a3c' : health >= 50 ? '#d97706' : '#dc2626' }}
                />
              </div>

              {/* Landscape Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#f3efe4]">
                <div className="flex items-center gap-2 text-xs text-[#52645a]">
                  <Trees className="size-4 text-[#005a3c]" />
                  <span>{Math.max(2, Math.round((health / 100) * 11))} Trees</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#52645a]">
                  <Sun className="size-4 text-[#d97706]" />
                  <span>{timeOfDay === 'night' ? 'Starry Sky' : health > 50 ? 'Clean Sky' : 'Misty Haze'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#52645a]">
                  <Waves className="size-4 text-[#0284c7]" />
                  <span>{health > 50 ? 'Flowing River' : 'Low River'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: World Events & Achievements */}
        <div className="flex flex-col gap-6">
          {/* World Events */}
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#005a3c]" />
                <h2 className="text-sm font-semibold text-[#062b20]">Ecosystem Events</h2>
              </div>
              <span className="text-[10px] text-[#718079]">Live feedback</span>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {worldEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-[#ede8dc] bg-[#fbf9f3] p-3 transition hover:border-[#005a3c]/30"
                  style={{ borderLeftWidth: 3, borderLeftColor: event.color }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{event.icon}</span>
                    <span className="text-xs font-semibold text-[#082a20]">{event.title}</span>
                  </div>
                  <p className="text-xs text-[#63736a] mt-1 leading-relaxed pl-6">{event.msg}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-[#005a3c]" />
                <h2 className="text-sm font-semibold text-[#062b20]">Eco Milestones</h2>
              </div>
              <span className="text-[10px] text-[#718079]">
                {achievements.filter(a => a.earned).length} / {achievements.length} unlocked
              </span>
            </div>

            <div className="mt-3.5 grid grid-cols-3 gap-2">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-xl border p-2.5 text-center transition ${
                    a.earned
                      ? 'border-[#cfe9d5] bg-[#f2f9f3] shadow-xs'
                      : 'border-[#ede9dc] bg-[#faf8f4] opacity-50 grayscale'
                  }`}
                >
                  <div className="text-xl mb-1">{a.icon}</div>
                  <div className="text-[11px] font-semibold text-[#082a20] leading-tight truncate">{a.title}</div>
                  <div className="text-[9px] text-[#718079] mt-0.5 line-clamp-2 leading-tight">{a.desc}</div>
                  {a.earned ? (
                    <div className="mt-1.5 text-[9px] font-semibold text-[#005a3c]">Unlocked ✓</div>
                  ) : (
                    <div className="mt-1.5 text-[9px] text-gray-400">Locked 🔒</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ShareImpactModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  )
}
