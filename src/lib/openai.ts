import { debriefSchema, scenarioSchema } from './zodSchemas'
import type { Debrief, Scenario, UserDecision } from '../types/scenario'

type ChatRole = 'system' | 'user' | 'assistant'

interface ChatMessage {
  role: ChatRole
  content: string
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

export interface GenerateScenarioParams {
  region:
    | 'pacific_northwest'
    | 'rocky_mountain'
    | 'northeast'
    | 'southeast'
    | 'midwest'
    | 'southwest'
  difficulty: 'student' | 'private_vfr' | 'private_ifr_current'
  failure_mode_preference:
    | 'random'
    | 'scud_running'
    | 'get_there_itis'
    | 'unforecast_imc'
    | 'marginal_night_vfr'
}

const SYSTEM_PROMPT = `You are a Designated Pilot Examiner (DPE) grading a VFR pilot's aeronautical decision-making against the FAA PAVE checklist (Pilot, Aircraft, enVironment, External pressures) and the 5P model (Plan, Plane, Pilot, Passengers, Programming).

You will receive a flight scenario and the pilot's decision. Grade the decision on a 0-100 scale based on:
1. Did they recognize the deteriorating trend in conditions?
2. Did they act before options closed (especially before reaching the scenario's decision_window state)?
3. Was the chosen action appropriate given the situation, terrain, and pilot experience level?
4. Timing - early decisions score higher than late ones, even for the same correct action.

Scoring guide:
- 90-100 (excellent): Right action taken at or before the decision window
- 70-89 (acceptable): Right action taken but late, or a defensible alternate action
- 40-69 (late): Action taken too late, options were already closing
- 0-39 (unsafe): Wrong action, or continued into IMC

If the user took no decision (timed out / continued by default into IMC), score 0-30 and treat it as an unsafe outcome.

If decision.action is 'loss_of_control': the DPE should grade this 0-15 with appropriate accident-pattern commentary about loss of control in IMC being the leading cause of fatal VFR-into-IMC accidents.

Return ONLY valid JSON matching this exact schema:
{
  "score": number (0-100),
  "decision_quality": "excellent" | "acceptable" | "late" | "unsafe",
  "timeline": [{ "time_sec": number, "event": string, "commentary": string }],
  "summary": string (2-3 sentences, direct DPE voice - pilots respect honesty over hand-holding),
  "ntsb_comparison": string (reference the scenario's failure_mode and ntsb_basis; explain what typically happens in real accidents matching this pattern, in the DPE's voice)
}

The timeline should have 3-5 events covering: scenario start, key trend recognition moment, the decision window, the user's actual decision, and outcome.`

const SCENARIO_GENERATOR_SYSTEM_PROMPT = `You are an aviation safety expert generating realistic VFR-into-IMC training scenarios based on real NTSB accident patterns. You will generate a complete training scenario in JSON format.

CRITICAL REQUIREMENTS:

1. Use REAL US airports with correct ICAO codes. Verify the codes are real airports in the requested region. Examples by region:
   - Pacific Northwest: KSEA, KPDX, KBLI, KHQM, KAST, KOLM, KFHR
   - Rocky Mountain: KGUC, KASE, KEGE, KAEJ, KMTJ, KCOS, KAPA
   - Northeast: KBDR, KOXC, KHPN, KPVD, KLEB, KBED, KBAF
   - Southeast: KCHA, KAVL, KGSP, KAGS, KMCN, KCSG
   - Midwest: KDEC, KSPI, KIJX, KCMI, KIND, KCID, KDSM
   - Southwest: KFLG, KGCN, KPRC, KSAF, KABQ, KFMN

2. METARs must be in correct FAA format that pilots can actually parse:
   Format: METAR ICAO DDHHMMZ WIND VISIBILITY [WEATHER] CLOUDS TEMP/DEW ALTIMETER
   Examples:
   - METAR KORE 281453Z 24015KT 3SM BR OVC008 12/11 A2987
   - METAR KAEJ 281500Z VRB05KT 10SM SCT080 BKN110 09/M01 A3002
   - METAR KGUC 281512Z 22024KT 1 1/2SM RA BR OVC005 04/04 A2990
   Visibility under 1 mile uses fractions: '1/2SM', '3/4SM'
   Visibility 1+ uses whole + fraction: '1 1/2SM', '2 1/2SM'
   Wind calm: '00000KT'. Wind variable under 6kts: 'VRB05KT'
   Cloud layers: SKC, FEW###, SCT###, BKN###, OVC### where ### is hundreds of feet
   Altimeter: A followed by 4 digits (no decimal): A2987 means 29.87

3. Weather progression must be realistic:
   - Ceilings drop gradually over minutes, not seconds. Reasonable rate: 500-1500 ft per minute.
   - Visibility decreases over multiple states, not in one jump.
   - Wind typically increases as fronts approach.
   - Temperature/dew point spread narrows as conditions deteriorate.

4. total_duration_sec MUST be 60. Generate exactly 6-8 ScenarioStates spaced roughly every 8-10 seconds within those 60 seconds. Decision window should be on a state at roughly 25-40 seconds in.

Time scale: scenarios are compressed for demonstration. Weather progression that would normally take 10 minutes is compressed to exactly 60 seconds. ABSOLUTE TIME CONSTRAINT: total_duration_sec MUST be exactly 60, the first ScenarioState must start at 0 seconds, and the final ScenarioState must end at 60 seconds.

5. Place a clear decision_window on one of the middle states (typically state 3 or 4) marking when the right call should be obvious to a competent pilot.

6. Reference the relevant NTSB accident pattern in the ntsb_basis field — describe the pattern in general terms (e.g., 'continued VFR flight into IMC over rising terrain leading to controlled flight into terrain'). Do NOT fabricate specific NTSB case numbers.

7. The failure_mode field describes what the unsafe pilot would do (the trap of the scenario), not the right answer.

8. Pilot experience level affects what decisions are appropriate. For 'student' and 'private_vfr', request_popup_ifr is generally not appropriate. For 'private_ifr_current', it is.

9. Include terrain_type appropriate to the region: use 'mountains' for Rocky Mountain and Pacific Northwest, 'flat' for Midwest, 'rolling_hills' or 'coastal' for Northeast/Southeast depending on the route, and 'mountains' or 'flat' for Southwest depending on the specific airports.

10. Include lighting appropriate to the scenario. Default to 'day'. Use 'dusk' or 'night' if the failure_mode_preference is 'marginal_night_vfr' or if the scenario is explicitly built around night or low-light VFR conditions.

Return ONLY valid JSON matching this exact schema (no markdown, no commentary):

{
  "id": string (kebab-case, descriptive),
  "title": string (5-8 words, evocative),
  "aircraft": "C172",
  "departure": Airport,
  "destination": Airport,
  "pilot_experience": "student" | "private_vfr" | "private_ifr_current",
  "terrain_type": "flat" | "mountains" | "rolling_hills" | "coastal",
  "lighting": "day" | "dusk" | "night" | "dawn",
  "failure_mode": string (1-2 sentences),
  "ntsb_basis": string (1-2 sentences),
  "total_duration_sec": 60,
  "states": ScenarioState[]
}

Where Airport = { icao, name, distance_nm, bearing, has_ils, current_metar }
And ScenarioState = { time_offset_sec, position: {lat, lon}, altitude_ft, weather: {timestamp, ceiling_ft, visibility_sm, wind_dir, wind_kts, precipitation, metar}, nearest_airports: Airport[], decision_window?: {correct_actions, rationale} }

PilotAction values for correct_actions: 'continue', 'turn_180', 'divert', 'declare_emergency', 'request_popup_ifr'`

function isStateImc(scenarioState: Scenario['states'][number]) {
  return (
    scenarioState.weather.visibility_sm < 1 ||
    scenarioState.weather.ceiling_ft < 1500
  )
}

function calculateImcSummary(
  scenario: Scenario,
  decision: UserDecision | null,
) {
  const decisionTime = decision?.time_taken_sec ?? scenario.total_duration_sec
  let imcSeconds = 0

  for (let index = 0; index < scenario.states.length; index += 1) {
    const state = scenario.states[index]
    const nextState = scenario.states[index + 1]
    const segmentStart = state.time_offset_sec
    const segmentEnd = Math.min(
      nextState?.time_offset_sec ?? scenario.total_duration_sec,
      decisionTime,
    )

    if (segmentEnd <= segmentStart) {
      continue
    }

    if (isStateImc(state)) {
      imcSeconds += segmentEnd - segmentStart
    }
  }

  const finalOutcome =
    decision?.action === 'loss_of_control'
      ? 'lost control'
      : imcSeconds > 0
        ? 'recovered'
        : 'made decision before IMC'

  return {
    imc_seconds: Math.round(imcSeconds * 10) / 10,
    final_outcome: finalOutcome,
    prompt_line: `IMC summary: pilot was in IMC for ${
      Math.round(imcSeconds * 10) / 10
    } seconds. Final outcome: ${finalOutcome}.`,
  }
}

function buildScenarioPrompt(scenario: Scenario, decision: UserDecision | null) {
  const imcSummary = calculateImcSummary(scenario, decision)
  const weatherProgression = scenario.states.map((state, index) => ({
    index,
    time_offset_sec: state.time_offset_sec,
    altitude_ft: Math.round(state.altitude_ft),
    weather: {
      ceiling_ft: state.weather.ceiling_ft,
      visibility_sm: state.weather.visibility_sm,
      wind_dir: state.weather.wind_dir,
      wind_kts: state.weather.wind_kts,
      precipitation: state.weather.precipitation,
      metar: state.weather.metar,
    },
    nearest_airports: state.nearest_airports.map((airport) => ({
      icao: airport.icao,
      distance_nm: airport.distance_nm,
      bearing: airport.bearing,
      has_ils: airport.has_ils,
      current_metar: airport.current_metar,
    })),
    decision_window: state.decision_window ?? null,
  }))

  const payload = {
    task: 'Grade this VFR-into-IMC training flight decision as a DPE.',
    scenario: {
      title: scenario.title,
      failure_mode: scenario.failure_mode,
      ntsb_basis: scenario.ntsb_basis ?? null,
      aircraft: scenario.aircraft,
      pilot_experience: scenario.pilot_experience,
      total_duration_sec: scenario.total_duration_sec,
      departure: scenario.departure.icao,
      destination: scenario.destination.icao,
      weather_progression: weatherProgression,
    },
    imc_summary: imcSummary.prompt_line,
    imc_summary_data: imcSummary,
    decision: decision
      ? {
          action: decision.action,
          time_taken_sec: decision.time_taken_sec,
          scenario_state_index: decision.scenario_state_index,
        }
      : {
          note: 'pilot did not act',
        },
  }

  return JSON.stringify(payload, null, 2)
}

async function requestChatCompletion(
  messages: ChatMessage[],
  apiKey: string,
  model: 'gpt-4o-mini' | 'gpt-4o',
  failureMessage: string,
) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages,
    }),
  })

  const data = (await response.json()) as ChatCompletionResponse

  if (!response.ok) {
    throw new Error(data.error?.message ?? failureMessage)
  }

  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('OpenAI returned an empty grading response.')
  }

  return content
}

async function requestDebrief(messages: ChatMessage[], apiKey: string) {
  return requestChatCompletion(
    messages,
    apiKey,
    'gpt-4o-mini',
    'OpenAI grading request failed.',
  )
}

function parseDebrief(content: string) {
  const parsed = JSON.parse(content) as unknown

  return debriefSchema.parse(parsed)
}

export async function gradeFlight(
  scenario: Scenario,
  decision: UserDecision | null,
): Promise<Debrief> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  console.log('API key present:', Boolean(apiKey))

  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY.')
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildScenarioPrompt(scenario, decision) },
  ]

  let previousContent = ''

  for (let attempt = 0; attempt < 2; attempt += 1) {
    console.log('fetching from OpenAI')
    previousContent = await requestDebrief(messages, apiKey)

    try {
      const debrief = parseDebrief(previousContent)

      console.log('graded successfully')

      return debrief
    } catch (error) {
      console.error('gradeFlight parse/validation error', error)

      if (attempt === 1) {
        throw error
      }

      messages.push(
        { role: 'assistant', content: previousContent },
        {
          role: 'user',
          content:
            'Your previous response was not valid JSON matching the schema. Return ONLY valid JSON matching the exact schema specified.',
        },
      )
    }
  }

  throw new Error('OpenAI grading response failed validation.')
}

function buildScenarioGeneratorPrompt(params: GenerateScenarioParams) {
  return JSON.stringify(
    {
      task: 'Generate a VFR-into-IMC training scenario matching these parameters.',
      region: params.region,
      difficulty: params.difficulty,
      failure_mode_preference: params.failure_mode_preference,
    },
    null,
    2,
  )
}

function parseScenario(content: string) {
  const parsed = JSON.parse(content) as unknown

  return scenarioSchema.parse(normalizeGeneratedScenarioTimeline(parsed))
}

function normalizeGeneratedScenarioTimeline(parsed: unknown) {
  if (!parsed || typeof parsed !== 'object') {
    return parsed
  }

  const candidate = parsed as {
    total_duration_sec?: unknown
    states?: unknown
  }

  if (!Array.isArray(candidate.states)) {
    return parsed
  }

  const states = candidate.states
  const previousTotal =
    typeof candidate.total_duration_sec === 'number' &&
    candidate.total_duration_sec > 0
      ? candidate.total_duration_sec
      : states.length > 1
        ? states.length - 1
        : 60
  const lastState = states[states.length - 1] as
    | { time_offset_sec?: unknown }
    | undefined
  const needsRescale =
    candidate.total_duration_sec !== 60 ||
    lastState?.time_offset_sec !== 60
  const scale = needsRescale ? 60 / previousTotal : 1
  const normalizedStates = states.map((state, index) => {
    if (!state || typeof state !== 'object') {
      return state
    }

    const scenarioState = state as {
      time_offset_sec?: unknown
      weather?: unknown
    }
    const fallbackOffset =
      states.length > 1 ? Math.round((60 * index) / (states.length - 1)) : 0
    let timeOffset =
      typeof scenarioState.time_offset_sec === 'number'
        ? Math.round(scenarioState.time_offset_sec * scale)
        : fallbackOffset

    if (index === 0) {
      timeOffset = 0
    }

    if (index === states.length - 1) {
      timeOffset = 60
    }

    timeOffset = Math.min(Math.max(timeOffset, 0), 60)

    const weather =
      scenarioState.weather && typeof scenarioState.weather === 'object'
        ? { ...scenarioState.weather, timestamp: timeOffset }
        : scenarioState.weather

    return {
      ...scenarioState,
      time_offset_sec: timeOffset,
      weather,
    }
  })

  return {
    ...candidate,
    total_duration_sec: 60,
    states: normalizedStates,
  }
}

export async function generateScenario(
  params: GenerateScenarioParams,
): Promise<Scenario> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY.')
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: SCENARIO_GENERATOR_SYSTEM_PROMPT },
    { role: 'user', content: buildScenarioGeneratorPrompt(params) },
  ]

  let previousContent = ''

  for (let attempt = 0; attempt < 2; attempt += 1) {
    previousContent = await requestChatCompletion(
      messages,
      apiKey,
      'gpt-4o',
      'OpenAI scenario generation request failed.',
    )

    try {
      return parseScenario(previousContent)
    } catch (error) {
      if (attempt === 1) {
        throw new Error(
          error instanceof Error
            ? `Generated scenario failed validation: ${error.message}`
            : 'Generated scenario failed validation.',
        )
      }

      const validationErrors =
        error instanceof Error ? error.message : String(error)

      messages.push(
        { role: 'assistant', content: previousContent },
        {
          role: 'user',
          content: `The generated scenario failed validation. Validation errors: ${validationErrors}. Return ONLY valid JSON matching the exact Scenario schema specified.`,
        },
      )
    }
  }

  throw new Error('OpenAI scenario generation response failed validation.')
}
