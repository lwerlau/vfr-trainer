import { scenarioSchema } from './zodSchemas'
import type { Scenario } from '../types/scenario'

export const GENERATED_SCENARIOS_STORAGE_KEY =
  'vfr-trainer:generated-scenarios'

export function loadGeneratedScenarios() {
  if (typeof window === 'undefined') {
    return []
  }

  const storedScenarios = window.localStorage.getItem(
    GENERATED_SCENARIOS_STORAGE_KEY,
  )

  if (!storedScenarios) {
    return []
  }

  try {
    const parsed = JSON.parse(storedScenarios) as unknown

    return scenarioSchema.array().parse(parsed)
  } catch {
    return []
  }
}

export function saveGeneratedScenarios(scenarios: Scenario[]) {
  window.localStorage.setItem(
    GENERATED_SCENARIOS_STORAGE_KEY,
    JSON.stringify(scenarios),
  )
}
