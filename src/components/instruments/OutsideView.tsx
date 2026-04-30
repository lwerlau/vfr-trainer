import type { Lighting, TerrainType } from '../../types/scenario'

interface OutsideViewProps {
  visibility_sm: number
  ceiling_ft: number
  terrain_type?: TerrainType
  lighting?: Lighting
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getBaseBackground(lighting: Lighting) {
  if (lighting === 'dusk') {
    return 'linear-gradient(to bottom, #0f172a 0%, #1e1b4b 34%, #8f3f1f 48%, #c46a2b 54%, #322a1e 61%, #132018 100%)'
  }

  if (lighting === 'night') {
    return 'linear-gradient(to bottom, #020617 0%, #06101f 48%, #050914 54%, #030604 100%)'
  }

  if (lighting === 'dawn') {
    return 'linear-gradient(to bottom, #0b1f3a 0%, #27496d 36%, #d99b9b 51%, #5d513e 59%, #172820 100%)'
  }

  return 'linear-gradient(to bottom, #2f80c3 0%, #75bce8 45%, #d8be83 52%, #587c42 100%)'
}

function getTerrainPalette(lighting: Lighting) {
  if (lighting === 'night') {
    return {
      primary: '#07111f',
      secondary: '#020617',
      water: '#061522',
      shoreline: '#1e3a4a',
      opacityMultiplier: 0.34,
    }
  }

  if (lighting === 'dusk' || lighting === 'dawn') {
    return {
      primary: '#172033',
      secondary: '#0f172a',
      water: '#1f3342',
      shoreline: '#527081',
      opacityMultiplier: 0.68,
    }
  }

  return {
    primary: '#273746',
    secondary: '#1f2937',
    water: '#294f66',
    shoreline: '#9cc4d7',
    opacityMultiplier: 1,
  }
}

function TerrainSilhouette({
  lighting,
  terrainType,
}: {
  lighting: Lighting
  terrainType: TerrainType
}) {
  if (terrainType === 'flat') {
    return null
  }

  const palette = getTerrainPalette(lighting)
  const opacity = palette.opacityMultiplier

  if (terrainType === 'mountains') {
    return (
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          d="M0 62 L6 54 L11 60 L18 45 L24 59 L31 38 L39 61 L46 47 L54 62 L61 41 L70 59 L78 35 L87 60 L94 50 L100 62 L100 100 L0 100 Z"
          fill={palette.primary}
          opacity={0.9 * opacity}
        />
        <path
          d="M0 68 L9 60 L17 66 L28 52 L38 67 L49 55 L60 69 L72 57 L82 68 L91 61 L100 69 L100 100 L0 100 Z"
          fill={palette.secondary}
          opacity={0.82 * opacity}
        />
      </svg>
    )
  }

  if (terrainType === 'rolling_hills') {
    return (
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          d="M0 68 C12 58 22 58 34 67 C47 76 59 57 72 64 C84 70 91 62 100 58 L100 100 L0 100 Z"
          fill={palette.primary}
          opacity={0.78 * opacity}
        />
        <path
          d="M0 75 C17 67 29 70 43 76 C59 83 73 69 100 73 L100 100 L0 100 Z"
          fill={palette.secondary}
          opacity={0.74 * opacity}
        />
      </svg>
    )
  }

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        d="M0 67 C16 64 23 66 34 65 C47 64 58 60 70 64 C82 68 91 66 100 64 L100 100 L0 100 Z"
        fill={palette.primary}
        opacity={0.58 * opacity}
      />
      <path
        d="M0 73 C18 71 36 75 52 72 C70 68 86 71 100 70 L100 100 L0 100 Z"
        fill={palette.water}
        opacity={0.52 * opacity}
      />
      <path
        d="M0 82 C15 80 30 83 46 81 C63 79 80 82 100 80"
        fill="none"
        stroke={palette.shoreline}
        strokeOpacity={0.28 * opacity}
        strokeWidth="1"
      />
    </svg>
  )
}

export function OutsideView({
  visibility_sm,
  ceiling_ft,
  terrain_type = 'flat',
  lighting = 'day',
}: OutsideViewProps) {
  const visibility = clamp(visibility_sm, 0, 10)
  const ceiling = clamp(ceiling_ft, 0, 10000)
  const baseBackground = getBaseBackground(lighting)
  const hazeOpacity = Math.max(0, Math.min(0.7, ((8 - visibility) / 7) * 0.7))
  const ceilingProgress = clamp((5000 - ceiling) / 4500, 0, 1)
  const cloudTranslateY = -100 + ceilingProgress * 100
  const visibilityImcProgress = clamp((1 - visibility) / 0.5, 0, 1)
  const ceilingImcProgress = clamp((500 - ceiling) / 200, 0, 1)
  const imcOpacity =
    visibility < 1 && ceiling < 500
      ? Math.min(visibilityImcProgress, ceilingImcProgress) * 0.95
      : 0
  const horizonOpacity = clamp(1 - hazeOpacity - ceilingProgress * 0.45, 0, 1)
  const lowLightHorizonMultiplier =
    lighting === 'night' ? 0.24 : lighting === 'dusk' || lighting === 'dawn' ? 0.58 : 1
  const lowLightTerrainMultiplier =
    lighting === 'night' ? 0.55 : lighting === 'dusk' || lighting === 'dawn' ? 0.82 : 1
  const terrainOpacity =
    clamp(1 - hazeOpacity * 0.9 - imcOpacity, 0, 1) *
    lowLightTerrainMultiplier

  return (
    <div
      className="relative h-full min-h-[12rem] w-full overflow-hidden rounded-lg border border-slate-700 bg-sky-700"
      role="img"
      aria-label="Outside windscreen view"
    >
      <div
        className="absolute inset-0"
        style={{
          background: baseBackground,
          transition: 'background 1000ms ease-out',
        }}
      />
      <div
        className="absolute inset-x-0 top-[52%] h-px"
        style={{
          backgroundColor:
            lighting === 'night'
              ? 'rgba(148, 163, 184, 0.24)'
              : 'rgba(2, 6, 23, 0.7)',
          opacity: horizonOpacity * lowLightHorizonMultiplier,
          transition: 'opacity 1000ms ease-out',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          opacity: terrainOpacity,
          transition: 'opacity 1000ms ease-out',
        }}
      >
        <TerrainSilhouette lighting={lighting} terrainType={terrain_type} />
      </div>

      <div
        className="absolute inset-0"
        style={{
          opacity: hazeOpacity,
          background:
            'linear-gradient(to bottom, rgba(226,232,240,0.68), rgba(148,163,184,0.72)), radial-gradient(circle at 24% 32%, rgba(255,255,255,0.38) 0 1px, transparent 1px), radial-gradient(circle at 71% 58%, rgba(71,85,105,0.3) 0 1px, transparent 1px)',
          backgroundSize: 'auto, 19px 19px, 27px 27px',
          backdropFilter: `blur(${hazeOpacity * 9}px)`,
          transition: 'opacity 1000ms ease-out, backdrop-filter 1000ms ease-out',
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-[70%]"
        style={{
          opacity: 0.96,
          transform: `translateY(${cloudTranslateY}%)`,
          background:
            'linear-gradient(to bottom, rgba(241,245,249,0.98), rgba(203,213,225,0.92) 46%, rgba(148,163,184,0.82) 76%, rgba(100,116,139,0.42)), radial-gradient(circle at 16% 74%, rgba(255,255,255,0.42) 0 18%, transparent 42%), radial-gradient(circle at 68% 86%, rgba(255,255,255,0.34) 0 16%, transparent 39%)',
          boxShadow: '0 18px 34px rgba(148, 163, 184, 0.28)',
          transition: 'transform 1000ms ease-out',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          opacity: imcOpacity,
          background:
            'linear-gradient(to bottom, rgba(248,250,252,0.98), rgba(226,232,240,0.96)), radial-gradient(circle at 30% 24%, rgba(255,255,255,0.45) 0 1px, transparent 1px), radial-gradient(circle at 70% 64%, rgba(148,163,184,0.3) 0 1px, transparent 1px)',
          backgroundSize: 'auto, 16px 16px, 24px 24px',
          backdropFilter: 'blur(12px)',
          transition: 'opacity 1000ms ease-out',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.22,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.42) 0 1px, transparent 1px), radial-gradient(circle at 70% 55%, rgba(15,23,42,0.24) 0 1px, transparent 1px), radial-gradient(circle at 42% 78%, rgba(255,255,255,0.28) 0 1px, transparent 1px)',
          backgroundSize: '17px 17px, 23px 23px, 31px 31px',
        }}
      />
    </div>
  )
}
