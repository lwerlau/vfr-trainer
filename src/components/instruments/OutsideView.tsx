interface OutsideViewProps {
  visibility_sm: number
  ceiling_ft: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function OutsideView({ visibility_sm, ceiling_ft }: OutsideViewProps) {
  const visibility = clamp(visibility_sm, 0, 10)
  const ceiling = clamp(ceiling_ft, 0, 10000)
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

  return (
    <div
      className="relative h-full min-h-[12rem] w-full overflow-hidden rounded-lg border border-slate-700 bg-sky-700"
      role="img"
      aria-label="Outside windscreen view"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #2f80c3 0%, #75bce8 45%, #d8be83 52%, #587c42 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-[52%] h-px bg-slate-950/70"
        style={{
          opacity: horizonOpacity,
          transition: 'opacity 1000ms ease-out',
        }}
      />

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
