interface AirspeedProps {
  airspeed_kts: number
}

const airspeedTicks = Array.from({ length: 10 }, (_, index) => index * 20)
const maxSpeed = 180

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function speedToAngle(speed: number) {
  return -135 + (clamp(speed, 0, maxSpeed) / maxSpeed) * 270
}

function pointOnCircle(angleDeg: number, radius: number) {
  const angleRad = (angleDeg * Math.PI) / 180

  return {
    x: 100 + Math.sin(angleRad) * radius,
    y: 100 - Math.cos(angleRad) * radius,
  }
}

function arcPath(startSpeed: number, endSpeed: number, radius: number) {
  const start = pointOnCircle(speedToAngle(startSpeed), radius)
  const end = pointOnCircle(speedToAngle(endSpeed), radius)
  const largeArc = Math.abs(speedToAngle(endSpeed) - speedToAngle(startSpeed)) > 180
    ? 1
    : 0

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export function Airspeed({ airspeed_kts }: AirspeedProps) {
  const safeAirspeed = clamp(airspeed_kts, 0, maxSpeed)
  const needleAngle = speedToAngle(safeAirspeed)

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 200 200"
      role="img"
      aria-label="Airspeed indicator"
    >
      <circle cx="100" cy="100" r="96" fill="#020617" />
      <circle cx="100" cy="100" r="86" fill="#030712" stroke="#475569" />

      <path
        d={arcPath(33, 85, 72)}
        fill="none"
        stroke="#f8fafc"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={arcPath(44, 127, 62)}
        fill="none"
        stroke="#22c55e"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={arcPath(127, 163, 62)}
        fill="none"
        stroke="#facc15"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {airspeedTicks.map((speed) => {
        const angle = speedToAngle(speed)
        const outer = pointOnCircle(angle, 78)
        const inner = pointOnCircle(angle, 67)
        const label = pointOnCircle(angle, 49)

        return (
          <g key={speed}>
            <line
              x1={outer.x}
              x2={inner.x}
              y1={outer.y}
              y2={inner.y}
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text
              x={label.x}
              y={label.y + 4}
              textAnchor="middle"
              fontSize="10"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fill="#f8fafc"
            >
              {speed}
            </text>
          </g>
        )
      })}

      <line
        x1={pointOnCircle(speedToAngle(163), 80).x}
        x2={pointOnCircle(speedToAngle(163), 58).x}
        y1={pointOnCircle(speedToAngle(163), 80).y}
        y2={pointOnCircle(speedToAngle(163), 58).y}
        stroke="#ef4444"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <g
        style={{
          transform: `rotate(${needleAngle}deg)`,
          transformOrigin: '100px 100px',
          transition: 'transform 200ms ease-out',
        }}
      >
        <line
          x1="100"
          x2="100"
          y1="112"
          y2="31"
          stroke="#f8fafc"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      <text
        x="100"
        y="135"
        textAnchor="middle"
        fontSize="10"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill="#94a3b8"
      >
        KNOTS
      </text>
      <circle cx="100" cy="100" r="6" fill="#e2e8f0" stroke="#020617" />
      <circle
        cx="100"
        cy="100"
        r="96"
        fill="none"
        stroke="#020617"
        strokeWidth="8"
      />
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#64748b"
        strokeWidth="1.5"
      />
    </svg>
  )
}
