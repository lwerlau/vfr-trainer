import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  Airspeed,
  Altimeter,
  AttitudeIndicator,
  HeadingIndicator,
  OutsideView,
} from '../components/instruments'
import { scenarios } from '../data/scenarios'
import { useSimulation } from '../hooks/useSimulation'
import { loadGeneratedScenarios } from '../lib/generatedScenarios'
import type {
  Airport,
  PilotAction,
  Scenario,
  UserDecision,
} from '../types/scenario'

interface SimLocationState {
  scenarioId?: string
}

interface HoldDecisionButtonProps {
  action: PilotAction
  label: string
  onConfirm: (action: PilotAction) => void
  disabled?: boolean
  variant?: 'normal' | 'danger'
}

const decisionLabels: Array<{
  action: PilotAction
  label: string
  variant?: HoldDecisionButtonProps['variant']
}> = [
  { action: 'continue', label: 'Continue' },
  { action: 'turn_180', label: 'Turn 180' },
  { action: 'declare_emergency', label: 'Declare Emergency', variant: 'danger' },
  { action: 'request_popup_ifr', label: 'Request Pop-up IFR' },
]

function formatElapsedTime(totalSeconds: number) {
  const boundedSeconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(boundedSeconds / 60)
  const seconds = boundedSeconds % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

function formatBearing(bearing: number) {
  return `${Math.round(bearing).toString().padStart(3, '0')} deg`
}

function getClosestAirport(airports: Airport[]) {
  return [...airports].sort((a, b) => a.distance_nm - b.distance_nm)[0]
}

function HoldDecisionButton({
  action,
  label,
  onConfirm,
  disabled = false,
  variant = 'normal',
}: HoldDecisionButtonProps) {
  const [isHolding, setIsHolding] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const cancelHold = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsHolding(false)
  }

  const startHold = () => {
    if (disabled || timeoutRef.current !== null) {
      return
    }

    setIsHolding(true)
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null
      setIsHolding(false)
      onConfirm(action)
    }, 2000)
  }

  useEffect(() => cancelHold, [])

  return (
    <button
      type="button"
      className={[
        'relative h-full min-h-20 overflow-hidden rounded-md border bg-slate-900 px-3 py-3 text-left font-mono text-xs font-semibold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'danger'
          ? 'border-red-500/40 text-red-200 hover:border-red-300 hover:shadow-[0_0_18px_rgba(248,113,113,0.22)]'
          : 'border-amber-400/30 text-amber-300 hover:border-amber-300 hover:shadow-[0_0_18px_rgba(251,191,36,0.18)]',
      ].join(' ')}
      disabled={disabled}
      onMouseDown={startHold}
      onMouseLeave={cancelHold}
      onMouseUp={cancelHold}
      onTouchCancel={cancelHold}
      onTouchEnd={cancelHold}
      onTouchStart={startHold}
    >
      <span
        className={[
          'absolute inset-y-0 left-0',
          variant === 'danger' ? 'bg-red-400/20' : 'bg-amber-300/20',
        ].join(' ')}
        style={{
          width: isHolding ? '100%' : '0%',
          transition: isHolding ? 'width 2000ms linear' : 'width 160ms ease-out',
        }}
      />
      <span className="relative z-10 block">{label}</span>
      <span className="relative z-10 mt-2 block text-[0.65rem] tracking-widest text-slate-400">
        Hold 2 sec
      </span>
    </button>
  )
}

export function SimPage() {
  const location = useLocation()
  const { scenarioId } = (location.state ?? {}) as SimLocationState
  const generatedScenarios = useMemo(() => loadGeneratedScenarios(), [])
  const scenario = useMemo(
    () =>
      [...scenarios, ...generatedScenarios].find(
        (candidate) => candidate.id === scenarioId,
      ),
    [generatedScenarios, scenarioId],
  )

  if (!scenarioId || !scenario) {
    return <Navigate to="/setup" replace />
  }

  return <ActiveSimulation scenario={scenario} />
}

function ActiveSimulation({ scenario }: { scenario: Scenario }) {
  const navigate = useNavigate()
  const {
    currentState,
    currentTimeOffset,
    isRunning,
    isFinished,
    currentInstruments,
    decision,
    recordDecision,
  } = useSimulation(scenario)
  const hasNavigatedRef = useRef(false)
  const airportsByDistance = useMemo(
    () =>
      [...currentState.nearest_airports].sort(
        (a, b) => a.distance_nm - b.distance_nm,
      ),
    [currentState.nearest_airports],
  )
  const closestAirport = getClosestAirport(currentState.nearest_airports)
  const [selectedDivertIcao, setSelectedDivertIcao] = useState(
    closestAirport?.icao ?? '',
  )
  const fuelPercent = Math.max(
    0,
    100 - (currentTimeOffset / scenario.total_duration_sec) * 100,
  )
  const currentMetar = closestAirport?.current_metar ?? currentState.weather.metar
  const urgentRed =
    currentState.weather.visibility_sm < 2 || currentState.weather.ceiling_ft < 700
  const urgentAmber =
    currentState.weather.visibility_sm < 5 ||
    currentState.weather.ceiling_ft < 1500
  const urgencyClass = urgentRed
    ? 'urgency-border--red'
    : urgentAmber
      ? 'urgency-border--amber'
      : ''
  const controlsDisabled = Boolean(decision)

  useEffect(() => {
    if (
      closestAirport &&
      !currentState.nearest_airports.some(
        (airport) => airport.icao === selectedDivertIcao,
      )
    ) {
      setSelectedDivertIcao(closestAirport.icao)
    }
  }, [closestAirport, currentState.nearest_airports, selectedDivertIcao])

  useEffect(() => {
    if (!decision || hasNavigatedRef.current) {
      return
    }

    hasNavigatedRef.current = true

    const debriefState: {
      scenario: Scenario
      decision: UserDecision
      fullDecisionHistory: UserDecision[]
    } = {
      scenario,
      decision,
      fullDecisionHistory: [decision],
    }

    navigate('/debrief', { state: debriefState })
  }, [decision, navigate, scenario])

  return (
    <section className="relative h-[calc(100vh-4rem)] overflow-hidden bg-[#030712] text-slate-100">
      <div className={`urgency-border ${urgencyClass}`} />

      <div className="grid h-full grid-rows-[60px_minmax(0,1fr)_80px_120px]">
        <header className="grid h-[60px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-white/10 bg-black px-4">
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-amber-400">
              {scenario.title}
            </h1>
            <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
              {isFinished ? 'Complete' : isRunning ? 'Live' : 'Paused'}
            </p>
          </div>

          <div className="font-mono text-sm text-slate-100">
            {formatElapsedTime(currentTimeOffset)} /{' '}
            {formatElapsedTime(scenario.total_duration_sec)}
          </div>

          <div className="ml-auto flex w-full max-w-48 items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
              Fuel
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full border border-slate-600 bg-slate-950">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-[width] duration-500"
                style={{ width: `${fuelPercent}%` }}
              />
            </div>
          </div>
        </header>

        <main className="grid min-h-0 gap-3 p-3 lg:grid-cols-[minmax(0,3fr)_minmax(20rem,2fr)]">
          <div className="min-h-0 rounded-xl border border-slate-800 bg-slate-950 p-2">
            <OutsideView
              ceiling_ft={currentState.weather.ceiling_ft}
              visibility_sm={currentState.weather.visibility_sm}
            />
          </div>

          <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-3">
            <div className="flex min-h-0 flex-col rounded-lg border border-slate-800 bg-black p-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300">
                Attitude
              </p>
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <AttitudeIndicator
                  pitch={currentInstruments.pitch}
                  roll={currentInstruments.roll}
                />
              </div>
            </div>

            <div className="flex min-h-0 flex-col rounded-lg border border-slate-800 bg-black p-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300">
                Altimeter
              </p>
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <Altimeter altitude_ft={currentInstruments.altitude_ft} />
              </div>
            </div>

            <div className="flex min-h-0 flex-col rounded-lg border border-slate-800 bg-black p-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300">
                Heading
              </p>
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <HeadingIndicator heading={currentInstruments.heading} />
              </div>
            </div>

            <div className="flex min-h-0 flex-col rounded-lg border border-slate-800 bg-black p-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300">
                Airspeed
              </p>
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <Airspeed airspeed_kts={currentInstruments.airspeed_kts} />
              </div>
            </div>
          </div>
        </main>

        <section className="min-h-0 border-y border-white/10 bg-black px-4 py-2">
          <p className="truncate font-mono text-sm text-emerald-300">
            {currentMetar}
          </p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {airportsByDistance.map((airport) => {
              const isClosest = airport.icao === closestAirport?.icao

              return (
                <div
                  key={airport.icao}
                  className={[
                    'flex shrink-0 items-center gap-3 rounded-md border px-3 py-1.5 font-mono text-xs',
                    isClosest
                      ? 'border-amber-400/70 bg-amber-400/10 text-amber-200'
                      : 'border-slate-700 bg-slate-950 text-slate-300',
                  ].join(' ')}
                >
                  <span className="font-semibold">{airport.icao}</span>
                  <span>{airport.distance_nm.toFixed(0)} NM</span>
                  <span>{formatBearing(airport.bearing)}</span>
                  {airport.has_ils ? (
                    <span className="rounded-sm border border-sky-300/50 px-1.5 py-0.5 text-[0.6rem] text-sky-200">
                      ILS
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>

        <section className="grid min-h-0 grid-cols-[repeat(5,minmax(9rem,1fr))] gap-3 bg-[#05070d] p-3">
          <HoldDecisionButton
            action="continue"
            disabled={controlsDisabled}
            label="Continue"
            onConfirm={recordDecision}
          />
          <HoldDecisionButton
            action="turn_180"
            disabled={controlsDisabled}
            label="Turn 180"
            onConfirm={recordDecision}
          />
          <div className="grid min-h-20 grid-rows-[auto_1fr] gap-2">
            <select
              className="h-8 rounded-md border border-slate-700 bg-slate-950 px-2 font-mono text-xs text-slate-200 outline-none focus:border-amber-300"
              disabled={controlsDisabled}
              value={selectedDivertIcao}
              onChange={(event) => setSelectedDivertIcao(event.target.value)}
            >
              {airportsByDistance.map((airport) => (
                <option key={airport.icao} value={airport.icao}>
                  {airport.icao} - {airport.distance_nm.toFixed(0)} NM
                </option>
              ))}
            </select>
            <HoldDecisionButton
              action="divert"
              disabled={controlsDisabled}
              label={`Divert ${selectedDivertIcao}`}
              onConfirm={recordDecision}
            />
          </div>
          {decisionLabels.slice(2).map((item) => (
            <HoldDecisionButton
              key={item.action}
              action={item.action}
              disabled={controlsDisabled}
              label={item.label}
              onConfirm={recordDecision}
              variant={item.variant}
            />
          ))}
        </section>
      </div>
    </section>
  )
}
