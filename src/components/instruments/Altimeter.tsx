interface AltimeterProps {
  altitude_ft: number
}

const altimeterNumbers = Array.from({ length: 10 }, (_, index) => index)
const altimeterTicks = Array.from({ length: 50 }, (_, index) => index)

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

export function Altimeter({ altitude_ft }: AltimeterProps) {
  const altitude = clamp(altitude_ft, 0, 15000)
  const tenThousandAngle = (altitude / 100000) * 360
  const thousandAngle = ((altitude % 10000) / 10000) * 360
  const hundredAngle = ((altitude % 1000) / 1000) * 360

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 200 200"
      role="img"
      aria-label="Altimeter"
    >
      <circle cx="100" cy="100" r="96" fill="#020617" />
      <circle cx="100" cy="100" r="88" fill="#050816" stroke="#475569" />
      <circle cx="100" cy="100" r="78" fill="#030712" stroke="#1e293b" />

      {altimeterTicks.map((tick) => {
        const angle = tick * 7.2
        const outer = pointOnCircle(angle, 76)
        const inner = pointOnCircle(angle, tick % 5 === 0 ? 63 : 69)

        return (
          <line
            key={tick}
            x1={outer.x}
            x2={inner.x}
            y1={outer.y}
            y2={inner.y}
            stroke="#e2e8f0"
            strokeWidth={tick % 5 === 0 ? 2 : 0.8}
            strokeLinecap="round"
          />
        )
      })}

      {altimeterNumbers.map((number) => {
        const point = pointOnCircle(number * 36, 53)

        return (
          <text
            key={number}
            x={point.x}
            y={point.y + 5}
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fill="#f8fafc"
          >
            {number}
          </text>
        )
      })}

      <text
        x="100"
        y="129"
        textAnchor="middle"
        fontSize="9"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill="#94a3b8"
      >
        ALT
      </text>

      <g
        style={{
          transform: `rotate(${tenThousandAngle}deg)`,
          transformOrigin: '100px 100px',
          transition: 'transform 200ms ease-out',
        }}
      >
        <line
          x1="100"
          x2="100"
          y1="105"
          y2="66"
          stroke="#f8fafc"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g
        style={{
          transform: `rotate(${thousandAngle}deg)`,
          transformOrigin: '100px 100px',
          transition: 'transform 200ms ease-out',
        }}
      >
        <line
          x1="100"
          x2="100"
          y1="108"
          y2="49"
          stroke="#cbd5e1"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </g>
      <g
        style={{
          transform: `rotate(${hundredAngle}deg)`,
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
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

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
