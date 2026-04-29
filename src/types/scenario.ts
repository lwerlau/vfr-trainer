export interface WeatherState {
  timestamp: number
  ceiling_ft: number
  visibility_sm: number
  wind_dir: number
  wind_kts: number
  precipitation: 'none' | 'rain' | 'snow' | 'mist'
  metar: string
}

export type PilotAction =
  | 'continue'
  | 'turn_180'
  | 'divert'
  | 'declare_emergency'
  | 'request_popup_ifr'
  | 'loss_of_control'

export interface Airport {
  icao: string
  name: string
  distance_nm: number
  bearing: number
  has_ils: boolean
  current_metar: string
}

export interface ScenarioState {
  time_offset_sec: number
  position: {
    lat: number
    lon: number
  }
  altitude_ft: number
  weather: WeatherState
  nearest_airports: Airport[]
  decision_window?: {
    correct_actions: PilotAction[]
    rationale: string
  }
}

export interface Scenario {
  id: string
  title: string
  aircraft: 'C172'
  departure: Airport
  destination: Airport
  pilot_experience: 'student' | 'private_vfr' | 'private_ifr_current'
  failure_mode: string
  ntsb_basis?: string
  states: ScenarioState[]
  total_duration_sec: number
}

export interface UserDecision {
  action: PilotAction
  time_taken_sec: number
  scenario_state_index: number
}

export interface TimelineEvent {
  time_sec: number
  event: string
  commentary: string
}

export interface Debrief {
  score: number
  decision_quality: 'excellent' | 'acceptable' | 'late' | 'unsafe'
  timeline: TimelineEvent[]
  summary: string
  ntsb_comparison?: string
}
