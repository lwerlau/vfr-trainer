import { Navigate, useLocation } from 'react-router-dom'

interface SimLocationState {
  scenarioId?: string
}

export function SimPage() {
  const location = useLocation()
  const { scenarioId } = (location.state ?? {}) as SimLocationState

  if (!scenarioId) {
    return <Navigate to="/setup" replace />
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl flex-col justify-center px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-300">
        Loaded scenario
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
        Simulation Page
      </h1>
      <p className="mt-4 font-mono text-sm text-slate-300">{scenarioId}</p>
    </section>
  )
}
