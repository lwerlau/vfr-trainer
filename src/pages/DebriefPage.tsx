import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { gradeFlight } from '../lib/openai'
import type { Debrief, Scenario, UserDecision } from '../types/scenario'

interface DebriefLocationState {
  scenario?: Scenario
  decision?: UserDecision | null
}

const qualityStyles: Record<Debrief['decision_quality'], string> = {
  excellent: 'border-emerald-400/50 text-emerald-300',
  acceptable: 'border-sky-400/50 text-sky-300',
  late: 'border-amber-400/50 text-amber-300',
  unsafe: 'border-red-400/50 text-red-300',
}

function formatDecisionLabel(decision: UserDecision | null) {
  if (!decision) {
    return 'No recorded action'
  }

  return decision.action.replaceAll('_', ' ')
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function DebriefPage() {
  const location = useLocation()
  const routeState = location.state as DebriefLocationState | null
  const scenario = routeState?.scenario
  const decision =
    routeState && 'decision' in routeState ? routeState.decision : undefined
  const [debrief, setDebrief] = useState<Debrief | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hasRequestedRef = useRef(false)

  useEffect(() => {
    if (!scenario || decision === undefined || hasRequestedRef.current) {
      return
    }

    hasRequestedRef.current = true
    let isActive = true

    gradeFlight(scenario, decision)
      .then((result) => {
        if (isActive) {
          setDebrief(result)
        }
      })
      .catch((caughtError: unknown) => {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'Unable to grade this flight.',
          )
        }
      })

    return () => {
      isActive = false
    }
  }, [decision, scenario])

  if (!scenario || decision === undefined) {
    return <Navigate to="/setup" replace />
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#030712] px-6 py-8 text-slate-100">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 border-b border-white/10 pb-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-300">
            Post-flight debrief
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
            {scenario.title}
          </h1>
          <p className="mt-2 font-mono text-sm uppercase text-slate-400">
            Decision: {formatDecisionLabel(decision)}
          </p>
        </header>

        {!debrief && !error ? (
          <div className="rounded-lg border border-amber-400/30 bg-slate-950 p-8 text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-amber-300">
              DPE is reviewing your flight...
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-400/40 bg-red-950/30 p-6">
            <h2 className="text-xl font-semibold text-red-200">
              Grading unavailable
            </h2>
            <p className="mt-3 text-sm leading-6 text-red-100/90">{error}</p>
            <Link
              className="mt-6 inline-flex rounded-md border border-amber-400/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-amber-300 hover:bg-amber-400/10"
              to="/setup"
            >
              Return to setup
            </Link>
          </div>
        ) : null}

        {debrief ? (
          <div className="grid gap-5">
            <section className="grid gap-4 rounded-lg border border-white/10 bg-slate-950 p-5 sm:grid-cols-[12rem_minmax(0,1fr)]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                  Score
                </p>
                <p className="mt-2 font-mono text-6xl font-semibold text-amber-300">
                  {Math.round(debrief.score)}
                </p>
              </div>
              <div>
                <span
                  className={[
                    'inline-flex rounded-md border px-3 py-1 font-mono text-xs uppercase tracking-[0.18em]',
                    qualityStyles[debrief.decision_quality],
                  ].join(' ')}
                >
                  {debrief.decision_quality}
                </span>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200">
                  {debrief.summary}
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-slate-950 p-5">
              <h2 className="font-mono text-sm uppercase tracking-[0.22em] text-amber-300">
                Timeline
              </h2>
              <ol className="mt-5 space-y-4">
                {debrief.timeline.map((event) => (
                  <li
                    className="grid gap-3 border-l border-slate-700 pl-4 sm:grid-cols-[5rem_minmax(0,1fr)]"
                    key={`${event.time_sec}-${event.event}`}
                  >
                    <span className="font-mono text-sm text-slate-400">
                      {formatTime(event.time_sec)}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-100">
                        {event.event}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        {event.commentary}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {debrief.ntsb_comparison ? (
              <section className="rounded-lg border border-white/10 bg-slate-950 p-5">
                <h2 className="font-mono text-sm uppercase tracking-[0.22em] text-amber-300">
                  Accident Pattern
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {debrief.ntsb_comparison}
                </p>
              </section>
            ) : null}

            <Link
              className="justify-self-start rounded-md border border-amber-400/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-amber-300 hover:bg-amber-400/10"
              to="/setup"
            >
              Fly another scenario
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
