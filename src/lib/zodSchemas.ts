import { z } from 'zod'
import type {
  Airport,
  Debrief,
  PilotAction,
  Scenario,
  ScenarioState,
  TimelineEvent,
  UserDecision,
  WeatherState,
} from '../types/scenario'

export const precipitationSchema = z.enum(['none', 'rain', 'snow', 'mist'])

export const weatherStateSchema = z.object({
  timestamp: z.number(),
  ceiling_ft: z.number(),
  visibility_sm: z.number(),
  wind_dir: z.number(),
  wind_kts: z.number(),
  precipitation: precipitationSchema,
  metar: z.string(),
}) satisfies z.ZodType<WeatherState>

export const pilotActionSchema = z.enum([
  'continue',
  'turn_180',
  'divert',
  'declare_emergency',
  'request_popup_ifr',
]) satisfies z.ZodType<PilotAction>

export const airportSchema = z.object({
  icao: z.string(),
  name: z.string(),
  distance_nm: z.number(),
  bearing: z.number(),
  has_ils: z.boolean(),
  current_metar: z.string(),
}) satisfies z.ZodType<Airport>

export const scenarioStateSchema = z.object({
  time_offset_sec: z.number(),
  position: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  altitude_ft: z.number(),
  weather: weatherStateSchema,
  nearest_airports: z.array(airportSchema),
  decision_window: z
    .object({
      correct_actions: z.array(pilotActionSchema),
      rationale: z.string(),
    })
    .optional(),
}) satisfies z.ZodType<ScenarioState>

export const scenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  aircraft: z.literal('C172'),
  departure: airportSchema,
  destination: airportSchema,
  pilot_experience: z.enum([
    'student',
    'private_vfr',
    'private_ifr_current',
  ]),
  failure_mode: z.string(),
  ntsb_basis: z.string().optional(),
  states: z.array(scenarioStateSchema),
  total_duration_sec: z.number(),
}) satisfies z.ZodType<Scenario>

export const userDecisionSchema = z.object({
  action: pilotActionSchema,
  time_taken_sec: z.number(),
  scenario_state_index: z.number(),
}) satisfies z.ZodType<UserDecision>

export const timelineEventSchema = z.object({
  time_sec: z.number(),
  event: z.string(),
  commentary: z.string(),
}) satisfies z.ZodType<TimelineEvent>

export const debriefSchema = z.object({
  score: z.number(),
  decision_quality: z.enum(['excellent', 'acceptable', 'late', 'unsafe']),
  timeline: z.array(timelineEventSchema),
  summary: z.string(),
  ntsb_comparison: z.string().optional(),
}) satisfies z.ZodType<Debrief>
