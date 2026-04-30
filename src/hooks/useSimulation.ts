import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  PilotAction,
  Scenario,
  ScenarioState,
  UserDecision,
} from '../types/scenario'

interface SimulationOptions {
  time_multiplier?: number
  auto_start?: boolean
}

interface InstrumentState {
  pitch: number
  roll: number
  altitude_ft: number
  heading: number
  airspeed_kts: number
}

interface ImcDisorientationState {
  active: boolean
  driftPitch: number
  driftRoll: number
  secondsInIMC: number
  lossOfControl: boolean
}

type RollCorrectionDirection = 'left' | 'right'
type PitchCorrectionDirection = 'up' | 'down'

const initialImcDisorientation: ImcDisorientationState = {
  active: false,
  driftPitch: 0,
  driftRoll: 0,
  secondsInIMC: 0,
  lossOfControl: false,
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

function getInterpolatedState(states: ScenarioState[], timeOffsetSec: number) {
  const stateIndex = getStateIndex(states, timeOffsetSec)
  const baseState = states[stateIndex]
  const nextState = states[stateIndex + 1]

  return {
    ...baseState,
    altitude_ft: interpolateAltitude(baseState, nextState, timeOffsetSec),
  }
}

function isInImc(state: ScenarioState) {
  return state.weather.visibility_sm < 1 || state.weather.ceiling_ft < 1500
}

function nextDisorientationState(
  current: ImcDisorientationState,
  active: boolean,
  deltaSeconds: number,
) {
  if (!active) {
    return {
      ...current,
      active: false,
      driftPitch: Math.abs(current.driftPitch) < 0.05 ? 0 : current.driftPitch * 0.95,
      driftRoll: Math.abs(current.driftRoll) < 0.05 ? 0 : current.driftRoll * 0.95,
      secondsInIMC: 0,
    }
  }

  const rollRandomWalk = (Math.random() - 0.5) * 2
  const pitchRandomWalk = (Math.random() - 0.5) * 2
  const driftRoll = clamp(
    current.driftRoll +
      (rollRandomWalk + 0.3 * current.driftRoll) * 0.05 * (deltaSeconds / 0.1),
    -90,
    90,
  )
  const driftPitch = clamp(
    current.driftPitch +
      (pitchRandomWalk * 0.65 + 0.18 * current.driftPitch) *
        0.035 *
        (deltaSeconds / 0.1),
    -45,
    45,
  )
  const secondsInIMC = current.secondsInIMC + deltaSeconds
  const lossOfControl =
    current.lossOfControl ||
    (secondsInIMC > 3 &&
      (Math.abs(driftRoll) > 60 || Math.abs(driftPitch) > 30))

  return {
    active,
    driftPitch,
    driftRoll,
    secondsInIMC,
    lossOfControl,
  }
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
  imcDisorientation: ImcDisorientationState
  decision: UserDecision | null
  recordDecision: (action: PilotAction) => void
  correctRoll: (direction: RollCorrectionDirection) => void
  correctPitch: (direction: PitchCorrectionDirection) => void
  pauseSim: () => void
  resumeSim: () => void
  resetSim: () => void
} {
  const timeMultiplier = options?.time_multiplier ?? 1
  const shouldAutoStart = options?.auto_start ?? true
  const [currentTimeOffset, setCurrentTimeOffset] = useState(0)
  const [isRunning, setIsRunning] = useState(shouldAutoStart)
  const [isFinished, setIsFinished] = useState(false)
  const [decision, setDecision] = useState<UserDecision | null>(null)
  const [imcDisorientation, setImcDisorientation] =
    useState<ImcDisorientationState>(initialImcDisorientation)
  const decisionRef = useRef<UserDecision | null>(null)

  useEffect(() => {
    decisionRef.current = decision
  }, [decision])

  useEffect(() => {
    setCurrentTimeOffset(0)
    setIsRunning(shouldAutoStart)
    setIsFinished(false)
    setDecision(null)
    setImcDisorientation(initialImcDisorientation)
    decisionRef.current = null
  }, [scenario.id, shouldAutoStart])

  const currentStateIndex = useMemo(
    () => getStateIndex(scenario.states, currentTimeOffset),
    [currentTimeOffset, scenario.states],
  )

  const currentState = useMemo(() => {
    return getInterpolatedState(scenario.states, currentTimeOffset)
  }, [currentTimeOffset, scenario.states])

  const currentInstruments = useMemo(() => {
    const baseHeading = routeHeadingForState(
      scenario.states,
      currentStateIndex,
      scenario.destination.bearing,
    )
    const pitchWobble =
      Math.sin((currentTimeOffset * 2 * Math.PI) / 5.6) * 1.4 +
      Math.sin((currentTimeOffset * 2 * Math.PI) / 4.1) * 0.6
    const rollWobble =
      Math.sin((currentTimeOffset * 2 * Math.PI) / 6.8) * 1.5 +
      Math.sin((currentTimeOffset * 2 * Math.PI) / 4.4) * 0.5
    const heading =
      baseHeading + Math.sin((currentTimeOffset * 2 * Math.PI) / 13) * 3
    const airspeed =
      95 +
      Math.sin((currentTimeOffset * 2 * Math.PI) / 5.1) * 2 +
      Math.sin((currentTimeOffset * 2 * Math.PI) / 7.3) * 1

    return {
      pitch: imcDisorientation.active
        ? imcDisorientation.driftPitch
        : pitchWobble,
      roll: imcDisorientation.active ? imcDisorientation.driftRoll : rollWobble,
      altitude_ft: currentState.altitude_ft,
      heading: normalizeHeading(heading),
      airspeed_kts: airspeed,
    }
  }, [
    currentState.altitude_ft,
    currentStateIndex,
    currentTimeOffset,
    imcDisorientation.active,
    imcDisorientation.driftPitch,
    imcDisorientation.driftRoll,
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

  const recordLossOfControl = useCallback(
    (timeOffsetSec: number) => {
      if (decisionRef.current) {
        return
      }

      const lossDecision = {
        action: 'loss_of_control' as const,
        time_taken_sec: timeOffsetSec,
        scenario_state_index: getStateIndex(scenario.states, timeOffsetSec),
      }

      decisionRef.current = lossDecision
      setDecision(lossDecision)
      setIsFinished(true)
      setIsRunning(false)
    },
    [scenario.states],
  )

  const correctRoll = useCallback((direction: RollCorrectionDirection) => {
    setImcDisorientation((current) => {
      if (!current.active || current.lossOfControl) {
        return current
      }

      const correction =
        direction === 'left'
          ? current.driftRoll > 0
            ? -8
            : -4
          : current.driftRoll < 0
            ? 8
            : 4

      return {
        ...current,
        driftRoll: clamp(current.driftRoll + correction, -90, 90),
      }
    })
  }, [])

  const correctPitch = useCallback((direction: PitchCorrectionDirection) => {
    setImcDisorientation((current) => {
      if (!current.active || current.lossOfControl) {
        return current
      }

      const correction =
        direction === 'up'
          ? current.driftPitch < 0
            ? 8
            : 4
          : current.driftPitch > 0
            ? -8
            : -4

      return {
        ...current,
        driftPitch: clamp(current.driftPitch + correction, -45, 45),
      }
    })
  }, [])

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
    setImcDisorientation(initialImcDisorientation)
    setIsFinished(false)
    setIsRunning(shouldAutoStart)
  }, [shouldAutoStart])

  useEffect(() => {
    if (!isRunning || isFinished) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setCurrentTimeOffset((previousOffset) => {
        const realDeltaSeconds = 0.1
        const simDeltaSeconds = realDeltaSeconds * timeMultiplier
        const nextOffset = Math.min(
          previousOffset + simDeltaSeconds,
          scenario.total_duration_sec,
        )
        const nextState = getInterpolatedState(scenario.states, nextOffset)

        setImcDisorientation((currentDisorientation) => {
          const nextDisorientation = nextDisorientationState(
            currentDisorientation,
            isInImc(nextState),
            realDeltaSeconds,
          )

          if (nextDisorientation.lossOfControl) {
            recordLossOfControl(nextOffset)
          }

          return nextDisorientation
        })

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
    recordLossOfControl,
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
    imcDisorientation,
    decision,
    recordDecision,
    correctRoll,
    correctPitch,
    pauseSim,
    resumeSim,
    resetSim,
  }
}
