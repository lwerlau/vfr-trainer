import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  PilotAction,
  Scenario,
  ScenarioState,
  UserDecision,
} from '../types/scenario'

interface SimulationOptions {
  time_multiplier?: number
}

interface InstrumentState {
  pitch: number
  roll: number
  altitude_ft: number
  heading: number
  airspeed_kts: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function normalizeHeading(heading: number) {
  return ((heading % 360) + 360) % 360
}

function getStateIndex(states: ScenarioState[], timeOffsetSec: number) {
  let stateIndex = 0

  for (let index = 0; index < states.length; index += 1) {
    if (states[index].time_offset_sec <= timeOffsetSec) {
      stateIndex = index
    }
  }

  return stateIndex
}

function interpolateAltitude(
  currentState: ScenarioState,
  nextState: ScenarioState | undefined,
  currentTimeOffset: number,
) {
  if (!nextState) {
    return currentState.altitude_ft
  }

  const span = nextState.time_offset_sec - currentState.time_offset_sec

  if (span <= 0) {
    return currentState.altitude_ft
  }

  const progress = clamp(
    (currentTimeOffset - currentState.time_offset_sec) / span,
    0,
    1,
  )

  return (
    currentState.altitude_ft +
    (nextState.altitude_ft - currentState.altitude_ft) * progress
  )
}

function bearingBetween(
  from: ScenarioState['position'],
  to: ScenarioState['position'],
) {
  const lat1 = (from.lat * Math.PI) / 180
  const lat2 = (to.lat * Math.PI) / 180
  const deltaLon = ((to.lon - from.lon) * Math.PI) / 180
  const y = Math.sin(deltaLon) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon)

  return normalizeHeading((Math.atan2(y, x) * 180) / Math.PI)
}

function routeHeadingForState(
  states: ScenarioState[],
  stateIndex: number,
  fallbackHeading: number,
) {
  const currentState = states[stateIndex]
  const nextState = states[stateIndex + 1]
  const previousState = states[stateIndex - 1]

  if (nextState) {
    return bearingBetween(currentState.position, nextState.position)
  }

  if (previousState) {
    return bearingBetween(previousState.position, currentState.position)
  }

  return fallbackHeading
}

export function useSimulation(
  scenario: Scenario,
  options?: SimulationOptions,
): {
  currentState: ScenarioState
  currentTimeOffset: number
  isRunning: boolean
  isFinished: boolean
  currentInstruments: InstrumentState
  decision: UserDecision | null
  recordDecision: (action: PilotAction) => void
  pauseSim: () => void
  resumeSim: () => void
  resetSim: () => void
} {
  const timeMultiplier = options?.time_multiplier ?? 1
  const [currentTimeOffset, setCurrentTimeOffset] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [decision, setDecision] = useState<UserDecision | null>(null)
  const decisionRef = useRef<UserDecision | null>(null)

  useEffect(() => {
    decisionRef.current = decision
  }, [decision])

  useEffect(() => {
    setCurrentTimeOffset(0)
    setIsRunning(true)
    setIsFinished(false)
    setDecision(null)
    decisionRef.current = null
  }, [scenario.id])

  const currentStateIndex = useMemo(
    () => getStateIndex(scenario.states, currentTimeOffset),
    [currentTimeOffset, scenario.states],
  )

  const currentState = useMemo(() => {
    const baseState = scenario.states[currentStateIndex]
    const nextState = scenario.states[currentStateIndex + 1]

    return {
      ...baseState,
      altitude_ft: interpolateAltitude(
        baseState,
        nextState,
        currentTimeOffset,
      ),
    }
  }, [currentStateIndex, currentTimeOffset, scenario.states])

  const currentInstruments = useMemo(() => {
    const baseHeading = routeHeadingForState(
      scenario.states,
      currentStateIndex,
      scenario.destination.bearing,
    )
    const pitch =
      Math.sin((currentTimeOffset * 2 * Math.PI) / 5.6) * 1.4 +
      Math.sin((currentTimeOffset * 2 * Math.PI) / 4.1) * 0.6
    const roll =
      Math.sin((currentTimeOffset * 2 * Math.PI) / 6.8) * 1.5 +
      Math.sin((currentTimeOffset * 2 * Math.PI) / 4.4) * 0.5
    const heading =
      baseHeading + Math.sin((currentTimeOffset * 2 * Math.PI) / 13) * 3
    const airspeed =
      95 +
      Math.sin((currentTimeOffset * 2 * Math.PI) / 5.1) * 2 +
      Math.sin((currentTimeOffset * 2 * Math.PI) / 7.3) * 1

    return {
      pitch,
      roll,
      altitude_ft: currentState.altitude_ft,
      heading: normalizeHeading(heading),
      airspeed_kts: airspeed,
    }
  }, [
    currentState.altitude_ft,
    currentStateIndex,
    currentTimeOffset,
    scenario.destination.bearing,
    scenario.states,
  ])

  const recordDecision = useCallback(
    (action: PilotAction) => {
      if (decisionRef.current) {
        return
      }

      const nextDecision = {
        action,
        time_taken_sec: currentTimeOffset,
        scenario_state_index: currentStateIndex,
      }

      decisionRef.current = nextDecision
      setDecision(nextDecision)
      setIsRunning(false)
    },
    [currentStateIndex, currentTimeOffset],
  )

  const pauseSim = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resumeSim = useCallback(() => {
    if (!isFinished && !decisionRef.current) {
      setIsRunning(true)
    }
  }, [isFinished])

  const resetSim = useCallback(() => {
    decisionRef.current = null
    setDecision(null)
    setCurrentTimeOffset(0)
    setIsFinished(false)
    setIsRunning(true)
  }, [])

  useEffect(() => {
    if (!isRunning || isFinished) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setCurrentTimeOffset((previousOffset) => {
        const nextOffset = Math.min(
          previousOffset + (100 * timeMultiplier) / 1000,
          scenario.total_duration_sec,
        )

        if (nextOffset >= scenario.total_duration_sec) {
          setIsFinished(true)
          setIsRunning(false)

          if (!decisionRef.current) {
            const finalDecision = {
              action: 'continue' as const,
              time_taken_sec: scenario.total_duration_sec,
              scenario_state_index: getStateIndex(
                scenario.states,
                scenario.total_duration_sec,
              ),
            }

            decisionRef.current = finalDecision
            setDecision(finalDecision)
          }
        }

        return nextOffset
      })
    }, 100)

    return () => window.clearInterval(intervalId)
  }, [
    isFinished,
    isRunning,
    scenario.states,
    scenario.total_duration_sec,
    timeMultiplier,
  ])

  return {
    currentState,
    currentTimeOffset,
    isRunning,
    isFinished,
    currentInstruments,
    decision,
    recordDecision,
    pauseSim,
    resumeSim,
    resetSim,
  }
}
