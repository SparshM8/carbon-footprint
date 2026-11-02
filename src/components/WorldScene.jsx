import React from 'react'
import PropTypes from 'prop-types'
import { getWorldHealth } from '../utils/calculations'

function lerp(a, b, t) {
  return a + (b - a) * t
}

function hexLerp(hex1, hex2, t) {
  const r1 = parseInt(hex1.slice(1, 3), 16)
  const g1 = parseInt(hex1.slice(3, 5), 16)
  const b1 = parseInt(hex1.slice(5, 7), 16)
  const r2 = parseInt(hex2.slice(1, 3), 16)
  const g2 = parseInt(hex2.slice(3, 5), 16)
  const b2 = parseInt(hex2.slice(5, 7), 16)
  const r = Math.round(lerp(r1, r2, t))
  const g = Math.round(lerp(g1, g2, t))
  const b = Math.round(lerp(b1, b2, t))
  return `rgb(${r},${g},${b})`
}

export default function WorldScene({ footprint, streak }) {
  const health = getWorldHealth(footprint, streak)
  const t = Math.max(0, Math.min(1, health / 100))

  // Color interpolation based on health
  const skyTop = hexLerp('#7a858d', '#38bdf8', t)
  const skyBottom = hexLerp('#c5ccd0', '#e0f2fe', t)
  const hillFar = hexLerp('#737f7d', '#529672', t)
  const hillMid = hexLerp('#6b7468', '#387c53', t)
  const hillNear = hexLerp('#656956', '#25603b', t)
  const treeLeafLight = hexLerp('#9ca3af', '#52c41a', t)
  const treeLeafDark = hexLerp('#4b5563', '#1b5e20', t)
  const riverTop = hexLerp('#889aa0', '#38bdf8', t)
  const riverBottom = hexLerp('#697e88', '#0284c7', t)

  // Tree population scales with health
  const treeCount = Math.max(2, Math.round(t * 11))
  const hazeOpacity = Math.max(0, (1 - t) * 0.45)
  const sunVisible = health > 30

  // Pre-calculated tree locations with depth & scale for realistic perspective
  const allTrees = [
    { x: 55, y: 195, scale: 0.65, type: 'pine' },
    { x: 95, y: 185, scale: 0.55, type: 'leafy' },
    { x: 140, y: 205, scale: 0.75, type: 'leafy' },
    { x: 190, y: 195, scale: 0.6, type: 'pine' },
    { x: 235, y: 220, scale: 0.8, type: 'leafy' },
    { x: 80, y: 240, scale: 1.0, type: 'leafy' },
    { x: 175, y: 250, scale: 0.95, type: 'pine' },
    { x: 385, y: 190, scale: 0.55, type: 'pine' },
    { x: 430, y: 205, scale: 0.7, type: 'leafy' },
    { x: 485, y: 195, scale: 0.6, type: 'pine' },
    { x: 530, y: 225, scale: 0.85, type: 'leafy' },
    { x: 415, y: 255, scale: 1.05, type: 'leafy' },
    { x: 510, y: 260, scale: 0.95, type: 'pine' },
  ]

  const activeTrees = allTrees.slice(0, treeCount)

  // Wildflower dots on foreground
  const flowers = [
    { x: 45, y: 275, color: '#f43f5e' },
    { x: 65, y: 290, color: '#eab308' },
    { x: 110, y: 270, color: '#f43f5e' },
    { x: 135, y: 285, color: '#ffffff' },
    { x: 455, y: 280, color: '#eab308' },
    { x: 480, y: 270, color: '#ffffff' },
    { x: 540, y: 285, color: '#f43f5e' },
    { x: 565, y: 275, color: '#eab308' },
  ]

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#e8e4d8] bg-[#fffdf8] shadow-sm">
      <svg
        viewBox="0 0 600 320"
        className="w-full h-auto block select-none"
        aria-label={`Living ecosystem visualization — health score ${health}%`}
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop} />
            <stop offset="100%" stopColor={skyBottom} />
          </linearGradient>

          {/* Sun Glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8db" stopOpacity="1" />
            <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* River Gradient */}
          <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={riverTop} />
            <stop offset="100%" stopColor={riverBottom} />
          </linearGradient>

          {/* Leafy Tree Foliage Gradient */}
          <linearGradient id="leafGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={treeLeafLight} />
            <stop offset="100%" stopColor={treeLeafDark} />
          </linearGradient>

          {/* Pine Tree Foliage Gradient */}
          <linearGradient id="pineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={treeLeafLight} />
            <stop offset="100%" stopColor={treeLeafDark} />
          </linearGradient>

          {/* Cloud Filter for Soft Glow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. SKY */}
        <rect x="0" y="0" width="600" height="320" fill="url(#skyGradient)" />

        {/* 2. SUN & HALO */}
        {sunVisible && (
          <g transform="translate(480, 60)">
            <circle cx="0" cy="0" r="48" fill="url(#sunGlow)" opacity={0.6} />
            <circle cx="0" cy="0" r="22" fill="#fef08a" />
            <circle cx="0" cy="0" r="20" fill="#facc15" />
          </g>
        )}

        {/* 3. FLUFFY DRIFTING CLOUDS */}
        {health > 40 && (
          <g fill="#ffffff" opacity={health > 70 ? 0.85 : 0.6}>
            {/* Cloud 1 */}
            <path
              d="M 70 70 q -15 0 -20 12 q -15 2 -15 15 q 0 14 15 15 h 70 q 15 0 15 -14 q 0 -12 -12 -15 q -2 -13 -18 -13 z"
              opacity="0.85"
            />
            {/* Cloud 2 */}
            <path
              d="M 270 50 q -12 0 -16 10 q -12 2 -12 12 q 0 12 12 12 h 55 q 12 0 12 -11 q 0 -10 -10 -12 q -2 -11 -15 -11 z"
              opacity="0.75"
            />
            {/* Cloud 3 */}
            {health > 70 && (
              <path
                d="M 370 75 q -10 0 -14 8 q -10 2 -10 10 q 0 10 10 10 h 45 q 10 0 10 -9 q 0 -8 -8 -10 q -2 -9 -13 -9 z"
                opacity="0.7"
              />
            )}
          </g>
        )}

        {/* 4. SOARING BIRDS (Present when health > 55%) */}
        {health > 55 && (
          <g stroke="#1e3a2e" strokeWidth="1.5" fill="none" opacity="0.65" strokeLinecap="round">
            <path d="M 180 85 q 6 -6 12 0 q 6 -6 12 0" />
            <path d="M 215 75 q 4 -4 8 0 q 4 -4 8 0" />
            <path d="M 205 95 q 3 -3 6 0 q 3 -3 6 0" />
          </g>
        )}

        {/* 5. DISTANT MOUNTAINS */}
        <path
          d="M 0 160 L 50 125 L 120 165 L 195 110 L 275 160 L 350 115 L 435 165 L 515 120 L 585 160 L 600 155 L 600 220 L 0 220 Z"
          fill={hillFar}
          opacity="0.4"
        />

        {/* 6. MID-GROUND ROLLING HILLS */}
        <path
          d="M 0 170 Q 110 135 220 160 T 440 160 Q 520 145 600 165 L 600 320 L 0 320 Z"
          fill={hillFar}
        />
        <path
          d="M 0 195 Q 160 155 310 195 T 600 185 L 600 320 L 0 320 Z"
          fill={hillMid}
        />

        {/* 7. WINDING NATURAL RIVER */}
        <path
          d="M 285 170 Q 315 205 270 235 Q 220 270 270 320 L 370 320 Q 315 270 330 235 Q 345 200 310 170 Z"
          fill="url(#riverGradient)"
        />

        {/* River Water Ripple Highlights */}
        <path
          d="M 290 200 Q 302 196 315 200"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
          fill="none"
        />
        <path
          d="M 268 235 Q 295 230 322 236"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
          fill="none"
        />
        <path
          d="M 265 275 Q 305 268 345 277"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
          fill="none"
        />

        {/* 8. FOREGROUND HILLS (Riverbanks) */}
        {/* Left Bank */}
        <path
          d="M 0 215 Q 130 195 255 240 L 255 320 L 0 320 Z"
          fill={hillNear}
        />
        {/* Right Bank */}
        <path
          d="M 335 240 Q 450 195 600 215 L 600 320 L 335 320 Z"
          fill={hillNear}
        />

        {/* 9. TREES WITH NATURAL BRANCHING AND DEPTH */}
        {activeTrees.map((tree, i) => {
          const { x, y, scale, type } = tree
          return (
            <g key={i} transform={`translate(${x}, ${y}) scale(${scale})`}>
              {/* Soft Tree Shadow */}
              <ellipse cx="0" cy="4" rx="14" ry="4" fill="rgba(0,0,0,0.18)" />

              {/* Trunk */}
              <path
                d="M -3 4 L -2 -18 L 2 -18 L 3 4 Z"
                fill={hexLerp('#855335', '#5a3821', t)}
              />

              {type === 'pine' ? (
                /* Evergreen Pine Tree (Layered Curved Tiers) */
                <g fill="url(#pineGradient)">
                  {/* Bottom Tier */}
                  <path d="M 0 -38 L -16 -18 Q 0 -22 16 -18 Z" opacity="0.95" />
                  {/* Middle Tier */}
                  <path d="M 0 -48 L -13 -30 Q 0 -34 13 -30 Z" opacity="0.98" />
                  {/* Top Tier */}
                  <path d="M 0 -58 L -9 -42 Q 0 -45 9 -42 Z" />
                </g>
              ) : (
                /* Lush Deciduous / Oak Tree (Cloud Foliage) */
                <g fill="url(#leafGradient)">
                  {/* Left foliage lobe */}
                  <circle cx="-9" cy="-28" r="11" opacity="0.95" />
                  {/* Right foliage lobe */}
                  <circle cx="9" cy="-28" r="11" opacity="0.95" />
                  {/* Bottom center lobe */}
                  <circle cx="0" cy="-24" r="12" opacity="0.95" />
                  {/* Top crown lobe with sunny highlight */}
                  <circle cx="0" cy="-35" r="13" />
                  {/* Subtle highlight sheen */}
                  <circle cx="-3" cy="-38" r="5" fill="#ffffff" opacity="0.2" />
                </g>
              )}
            </g>
          )
        })}

        {/* 10. WILDFLOWERS (Foreground Dots when health > 60) */}
        {health > 60 &&
          flowers.map((f, idx) => (
            <g key={idx} transform={`translate(${f.x}, ${f.y})`}>
              <circle cx="0" cy="0" r="2.2" fill={f.color} />
              <circle cx="0" cy="0" r="0.8" fill="#ffffff" opacity="0.8" />
            </g>
          ))}

        {/* 11. POLLUTION / SMOG OVERLAY (When health < 50%) */}
        {hazeOpacity > 0 && (
          <rect
            x="0"
            y="0"
            width="600"
            height="320"
            fill="#78716c"
            opacity={hazeOpacity}
          />
        )}
      </svg>
    </div>
  )
}

WorldScene.propTypes = {
  footprint: PropTypes.object.isRequired,
  streak: PropTypes.number.isRequired,
}
