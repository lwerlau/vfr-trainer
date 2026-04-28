interface HeadingIndicatorProps {
  heading: number
}

const headingTicks = Array.from({ length: 12 }, (_, index) => index * 30)
const cardinalLabels = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
]

function normalizeHeading(heading: number) {
  return ((heading % 360) + 360) % 360
}

function pointOnCircle(angleDeg: number, radius: number) {
  const angleRad = (angleDeg * Math.PI) / 180

  return {
    x: 100 + Math.sin(angleRad) * radius,
    y: 100 - Math.cos(angleRad) * radius,
  }
}

export function HeadingIndicator({ heading }: HeadingIndicatorProps) {
  const safeHeading = normalizeHeading(heading)

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 200 200"
      role="img"
      aria-label="Heading indicator"
    >
      <circle cx="100" cy="100" r="96" fill="#020617" />
      <circle cx="100" cy="100" r="86" fill="#030712" stroke="#475569" />

      <g
        style={{
          transform: `rotate(${-safeHeading}deg)`,
          transformOrigin: '100px 100px',
          transition: 'transform 200ms ease-out',
        }}
      >
        {headingTicks.map((tick) => {
          const outer = pointOnCircle(tick, 76)
          const inner = pointOnCircle(tick, 64)

          return (
            <line
              key={tick}
              x1={outer.x}
              x2={inner.x}
              y1={outer.y}
              y2={inner.y}
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )
        })}

        {cardinalLabels.map((item) => {
          const point = pointOnCircle(item.angle, 50)

          return (
            <text
              key={item.label}
              x={point.x}
              y={point.y + 6}
              textAnchor="middle"
              fontSize="18"
              fontWeight="700"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fill="#f8fafc"
            >
              {item.label}
            </text>
          )
        })}
      </g>

      <path d="M100 18 L94 32 H106 Z" fill="#fbbf24" />
      <g fill="none" stroke="#7dd3fc" strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 58 L108 103 L100 96 L92 103 Z" strokeWidth="3" />
        <line x1="78" x2="122" y1="116" y2="116" strokeWidth="3" />
      </g>
      <text
        x="100"
        y="153"
        textAnchor="middle"
        fontSize="14"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill="#fbbf24"
      >
        {Math.round(safeHeading).toString().padStart(3, '0')}
      </text>

      <circle cx="100" cy="100" r="5" fill="#e2e8f0" />
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
