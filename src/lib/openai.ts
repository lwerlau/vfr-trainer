import { debriefSchema } from './zodSchemas'
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

Return ONLY valid JSON matching this exact schema:
{
  "score": number (0-100),
  "decision_quality": "excellent" | "acceptable" | "late" | "unsafe",
  "timeline": [{ "time_sec": number, "event": string, "commentary": string }],
  "summary": string (2-3 sentences, direct DPE voice - pilots respect honesty over hand-holding),
  "ntsb_comparison": string (reference the scenario's failure_mode and ntsb_basis; explain what typically happens in real accidents matching this pattern, in the DPE's voice)
}

The timeline should have 3-5 events covering: scenario start, key trend recognition moment, the decision window, the user's actual decision, and outcome.`

function buildScenarioPrompt(scenario: Scenario, decision: UserDecision | null) {
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

async function requestDebrief(messages: ChatMessage[], apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages,
    }),
  })

  const data = (await response.json()) as ChatCompletionResponse

  if (!response.ok) {
    throw new Error(data.error?.message ?? 'OpenAI grading request failed.')
  }

  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('OpenAI returned an empty grading response.')
  }

  return content
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

  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY.')
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildScenarioPrompt(scenario, decision) },
  ]

  let previousContent = ''

  for (let attempt = 0; attempt < 2; attempt += 1) {
    previousContent = await requestDebrief(messages, apiKey)

    try {
      return parseDebrief(previousContent)
    } catch (error) {
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
