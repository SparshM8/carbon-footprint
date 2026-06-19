import React from 'react'
import { getWorldHealth } from '../utils/calculations'

function lerp(a, b, t) { return a + (b - a) * t }

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
  const t = health / 100

  const skyColor = hexLerp('#6b7280', '#7ec8e3', t)
  const groundColor = hexLerp('#92400e', '#2d6a4f', t)
  const treeColor = hexLerp('#6b7280', '#1b4332', t)
  const treeCount = Math.max(1, Math.round(t * 7))
  const hazeOpacity = Math.max(0, (1 - t) * 0.55)
  const sunVisible = health > 45
  const riverWidth = Math.round(lerp(4, 24, t))

  const treePositions = [40, 70, 105, 140, 175, 210, 245]

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100">
      <svg viewBox="0 0 290 160" width="100%" aria-label={`Living world ecosystem — health ${health}%`}>
        {/* Sky */}
        <rect x="0" y="0" width="290" height="105" fill={skyColor} />

        {/* Sun */}
        {sunVisible && (
          <circle cx="240" cy="28" r={Math.round(lerp(6, 18, t))} fill="#fbbf24" opacity={0.85} />
        )}

        {/* Clouds */}
        {health > 55 && (
          <>
            <ellipse cx="60" cy="35" rx="28" ry="11" fill="white" opacity="0.7" />
            <ellipse cx="78" cy="30" rx="18" ry="9" fill="white" opacity="0.7" />
          </>
        )}
        {health > 75 && (
          <ellipse cx="180" cy="25" rx="22" ry="9" fill="white" opacity="0.65" />
        )}

        {/* Smog/haze overlay */}
        <rect x="0" y="0" width="290" height="105" fill="#78716c" opacity={hazeOpacity} />

        {/* Smoke particles when health low */}
        {health < 40 && (
          <>
            <circle cx="80" cy="75" r="5" fill="#d6d3d1" opacity="0.5" />
            <circle cx="160" cy="65" r="7" fill="#d6d3d1" opacity="0.4" />
            <circle cx="220" cy="80" r="4" fill="#d6d3d1" opacity="0.45" />
          </>
        )}

        {/* Ground */}
        <rect x="0" y="100" width="290" height="60" fill={groundColor} />

        {/* River */}
        <rect
          x={Math.round((290 - riverWidth) / 2)} y="105"
          width={riverWidth} height="55"
          fill={health > 50 ? '#38bdf8' : '#92400e'}
          opacity={health > 50 ? 0.75 : 0.3}
          rx="2"
        />

        {/* Trees */}
        {treePositions.slice(0, treeCount).map((x, i) => {
          const h = 18 + (i % 3) * 8
          const w = 14 + (i % 3) * 6
          return (
            <g key={i}>
              <rect
                x={x - 2} y={105 - h}
                width="4" height={h * 0.35}
                fill={hexLerp('#78350f', '#5c3d11', t)}
                rx="1"
              />
              <ellipse
                cx={x} cy={105 - h + 4}
                rx={w / 2} ry={h * 0.6}
                fill={hexLerp('#4b5563', treeColor, t)}
                opacity={0.9}
              />
            </g>
          )
        })}

        {/* Health bar */}
        <rect x="10" y="148" width="270" height="6" rx="3" fill="rgba(0,0,0,0.2)" />
        <rect
          x="10" y="148"
          width={Math.round(270 * (health / 100))}
          height="6" rx="3"
          fill={health > 60 ? '#4ade80' : health > 35 ? '#fbbf24' : '#f87171'}
        />
        <text x="145" y="146" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.85)">
          Ecosystem health — {health}%
        </text>
      </svg>
    </div>
  )
}
