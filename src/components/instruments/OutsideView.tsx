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
  const imc = visibility < 1 || ceiling < 500
  const visibilityLoss = clamp((5 - visibility) / 5, 0, 1)
  const lowCeiling = clamp((1500 - ceiling) / 1500, 0, 1)
  const grayOpacity = imc
    ? 0.86
    : clamp(visibilityLoss * 0.58 + lowCeiling * 0.28, 0, 0.76)
  const blurPx = imc ? 10 : visibilityLoss * 7
  const cloudOpacity = imc ? 0.95 : lowCeiling * 0.82
  const horizonOpacity = imc ? 0.08 : clamp(0.7 - visibilityLoss * 0.5, 0.18, 0.7)

  return (
    <div
      className="relative h-full min-h-[12rem] w-full overflow-hidden rounded-lg border border-slate-700 bg-sky-700 transition-all duration-1000"
      style={{
        filter: `saturate(${1 - visibilityLoss * 0.55}) contrast(${
          1 - visibilityLoss * 0.18
        })`,
      }}
      role="img"
      aria-label="Outside windscreen view"
    >
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background:
            'linear-gradient(to bottom, #4f9bd8 0%, #8cc7ea 42%, #d7c48a 58%, #4f7f4a 100%)',
          opacity: imc ? 0.16 : 1,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 transition-all duration-1000"
        style={{
          height: `${imc ? 100 : 34 + lowCeiling * 46}%`,
          background:
            'linear-gradient(to bottom, rgba(226,232,240,0.96), rgba(148,163,184,0.72), rgba(148,163,184,0.12))',
          opacity: cloudOpacity,
        }}
      />
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backdropFilter: `blur(${blurPx}px)`,
          backgroundColor: `rgba(226, 232, 240, ${grayOpacity})`,
        }}
      />
      <div
        className="absolute inset-x-0 top-[54%] h-px bg-slate-900/60 transition-opacity duration-1000"
        style={{ opacity: horizonOpacity }}
      />
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.38) 0 1px, transparent 1px), radial-gradient(circle at 62% 47%, rgba(15,23,42,0.28) 0 1px, transparent 1px), radial-gradient(circle at 35% 78%, rgba(255,255,255,0.24) 0 1px, transparent 1px)',
          backgroundSize: '18px 18px, 24px 24px, 31px 31px',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-950/25 to-transparent" />
    </div>
  )
}
