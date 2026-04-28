import { useId } from 'react'

interface AttitudeIndicatorProps {
  pitch: number
  roll: number
}

const pitchMarks = [-30, -20, -10, 10, 20, 30]
const rollTicks = [-60, -30, -20, -10, 0, 10, 20, 30, 60]
const pitchScale = 2.1

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function pointOnCircle(angleDeg: number, radius: number) {
  const angleRad = (angleDeg * Math.PI) / 180

  return {
    x: 100 + Math.sin(angleRad) * radius,
    y: 100 - Math.cos(angleRad) * radius,
  }
}

export function AttitudeIndicator({ pitch, roll }: AttitudeIndicatorProps) {
  const rawClipId = useId()
  const clipId = `attitude-${rawClipId.replace(/:/g, '')}`
  const safePitch = clamp(pitch, -30, 30)
  const safeRoll = clamp(roll, -60, 60)

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 200 200"
      role="img"
      aria-label="Attitude indicator"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="100" cy="100" r="78" />
        </clipPath>
        <radialGradient id={`${clipId}-bezel`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="55%" stopColor="#111827" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="96" fill={`url(#${clipId}-bezel)`} />
      <circle cx="100" cy="100" r="84" fill="#020617" stroke="#475569" />

      <g clipPath={`url(#${clipId})`}>
        <g
          style={{
            transform: `rotate(${-safeRoll}deg) translateY(${
              safePitch * pitchScale
            }px)`,
            transformOrigin: '100px 100px',
            transition: 'transform 200ms ease-out',
          }}
        >
          <rect x="-180" y="-220" width="560" height="320" fill="#2f7db8" />
          <rect x="-180" y="100" width="560" height="320" fill="#8a5b34" />
          <rect x="-180" y="96" width="560" height="8" fill="#d8b276" />
          <line
            x1="-180"
            x2="380"
            y1="100"
            y2="100"
            stroke="#f8fafc"
            strokeWidth="1.5"
          />

          {pitchMarks.map((mark) => {
            const y = 100 - mark * pitchScale
            const width = Math.abs(mark) === 30 ? 46 : 34

            return (
              <g key={mark}>
                <line
                  x1={100 - width / 2}
                  x2={100 + width / 2}
                  y1={y}
                  y2={y}
                  stroke="#f8fafc"
                  strokeWidth="1.6"
                />
                <text
                  x={100 - width / 2 - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="8"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fill="#f8fafc"
                >
                  {Math.abs(mark)}
                </text>
                <text
                  x={100 + width / 2 + 8}
                  y={y + 3}
                  textAnchor="start"
                  fontSize="8"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fill="#f8fafc"
                >
                  {Math.abs(mark)}
                </text>
              </g>
            )
          })}
        </g>
      </g>

      <circle
        cx="100"
        cy="100"
        r="78"
        fill="none"
        stroke="#111827"
        strokeWidth="5"
      />

      {rollTicks.map((tick) => {
        const outer = pointOnCircle(tick, 90)
        const inner = pointOnCircle(tick, Math.abs(tick) === 60 ? 80 : 84)

        return (
          <line
            key={tick}
            x1={outer.x}
            x2={inner.x}
            y1={outer.y}
            y2={inner.y}
            stroke={tick === 0 ? '#fbbf24' : '#e2e8f0'}
            strokeWidth={tick === 0 ? 2 : 1.4}
            strokeLinecap="round"
          />
        )
      })}

      <path d="M100 12 L94 25 H106 Z" fill="#fbbf24" />

      <g fill="none" stroke="#f8fafc" strokeLinecap="round">
        <line x1="64" x2="90" y1="100" y2="100" strokeWidth="4" />
        <line x1="110" x2="136" y1="100" y2="100" strokeWidth="4" />
        <line x1="76" x2="94" y1="104" y2="100" strokeWidth="3" />
        <line x1="106" x2="124" y1="100" y2="104" strokeWidth="3" />
        <circle cx="100" cy="100" r="3.5" fill="#f8fafc" stroke="none" />
      </g>

      <circle
        cx="100"
        cy="100"
        r="96"
        fill="none"
        stroke="#020617"
        strokeWidth="7"
      />
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#64748b"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  )
}
