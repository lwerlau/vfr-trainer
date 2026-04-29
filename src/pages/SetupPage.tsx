import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { scenarios } from '../data/scenarios'
import {
  loadGeneratedScenarios,
  saveGeneratedScenarios,
} from '../lib/generatedScenarios'
import { generateScenario, type GenerateScenarioParams } from '../lib/openai'
import type { Scenario } from '../types/scenario'

const pilotExperienceLabels: Record<Scenario['pilot_experience'], string> = {
  student: 'Student Pilot',
  private_vfr: 'Private Pilot - VFR',
  private_ifr_current: 'Private Pilot - IFR Current',
}

const regionOptions: Array<{
  value: GenerateScenarioParams['region']
  label: string
}> = [
  { value: 'pacific_northwest', label: 'Pacific Northwest' },
  { value: 'rocky_mountain', label: 'Rocky Mountain' },
  { value: 'northeast', label: 'Northeast' },
  { value: 'southeast', label: 'Southeast' },
  { value: 'midwest', label: 'Midwest' },
  { value: 'southwest', label: 'Southwest' },
]

const difficultyOptions: Array<{
  value: GenerateScenarioParams['difficulty']
  label: string
}> = [
  { value: 'student', label: 'Student Pilot' },
  { value: 'private_vfr', label: 'Private Pilot (VFR)' },
  { value: 'private_ifr_current', label: 'Private Pilot (IFR Current)' },
]

const failureModeOptions: Array<{
  value: GenerateScenarioParams['failure_mode_preference']
  label: string
}> = [
  { value: 'random', label: 'Random' },
  { value: 'scud_running', label: 'Scud Running' },
  { value: 'get_there_itis', label: 'Get-There-itis' },
  { value: 'unforecast_imc', label: 'Unforecast IMC' },
  { value: 'marginal_night_vfr', label: 'Marginal Night VFR' },
]

function formatDuration(totalDurationSec: number) {
  return `${Math.round(totalDurationSec / 60)} min`
}

function ensureUniqueScenarioId(
  scenario: Scenario,
  existingScenarios: Scenario[],
) {
  const existingIds = new Set(existingScenarios.map((item) => item.id))

  if (!existingIds.has(scenario.id)) {
    return scenario
  }

  return {
    ...scenario,
    id: `${scenario.id}-${Date.now().toString(36)}`,
  }
}

interface ScenarioCardProps {
  scenario: Scenario
  isGenerated?: boolean
  onDelete?: (scenarioId: string) => void
  onStart: (scenarioId: string) => void
}

function ScenarioCard({
  scenario,
  isGenerated = false,
  onDelete,
  onStart,
}: ScenarioCardProps) {
  return (
    <article className="relative flex min-h-[30rem] flex-col rounded-lg border border-white/10 bg-slate-900/95 p-6 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-amber-950/30">
      {isGenerated ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-md border border-sky-300/30 bg-sky-300/10 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-sky-200">
            AI Generated
          </span>
          <button
            type="button"
            className="rounded-md border border-slate-700 px-2 py-1 font-mono text-xs text-slate-400 transition hover:border-red-300 hover:text-red-200"
            aria-label={`Delete ${scenario.title}`}
            onClick={() => onDelete?.(scenario.id)}
          >
            X
          </button>
        </div>
      ) : null}

      <div className="flex-1">
        <h2 className="text-2xl font-semibold tracking-normal text-slate-50">
          {scenario.title}
        </h2>

        <div className="mt-5 flex items-center gap-3 font-mono text-sm text-amber-300">
          <span>{scenario.departure.icao}</span>
          <span aria-hidden="true">&rarr;</span>
          <span>{scenario.destination.icao}</span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-widest text-slate-500">
              Aircraft
            </dt>
            <dd className="mt-1 font-medium text-slate-100">
              {scenario.aircraft}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-slate-500">
              Duration
            </dt>
            <dd className="mt-1 font-medium text-slate-100">
              {formatDuration(scenario.total_duration_sec)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs uppercase tracking-widest text-slate-500">
              Pilot
            </dt>
            <dd className="mt-1 font-medium text-slate-100">
              {pilotExperienceLabels[scenario.pilot_experience]}
            </dd>
          </div>
        </dl>

        <div className="mt-6 rounded-md border border-slate-700 bg-slate-950/70 p-3">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Initial METAR
          </p>
          <p className="mt-2 font-mono text-xs leading-5 text-slate-300">
            {scenario.states[0]?.weather.metar}
          </p>
        </div>

        <p className="mt-6 text-sm leading-6 text-slate-300">
          {scenario.failure_mode}
        </p>
      </div>

      <button
        type="button"
        className="mt-8 rounded-md bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
        onClick={() => onStart(scenario.id)}
      >
        Start Flight
      </button>
    </article>
  )
}

export function SetupPage() {
  const navigate = useNavigate()
  const [generatedScenarios, setGeneratedScenarios] = useState<Scenario[]>([])
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [generatorParams, setGeneratorParams] =
    useState<GenerateScenarioParams>({
      region: 'rocky_mountain',
      difficulty: 'private_vfr',
      failure_mode_preference: 'random',
    })
  const allScenarios = useMemo(
    () => [...generatedScenarios, ...scenarios],
    [generatedScenarios],
  )

  useEffect(() => {
    setGeneratedScenarios(loadGeneratedScenarios())
  }, [])

  const startScenario = (scenarioId: string) => {
    navigate('/sim', { state: { scenarioId } })
  }

  const deleteGeneratedScenario = (scenarioId: string) => {
    const nextScenarios = generatedScenarios.filter(
      (scenario) => scenario.id !== scenarioId,
    )

    setGeneratedScenarios(nextScenarios)
    saveGeneratedScenarios(nextScenarios)
  }

  const updateGeneratorParam = <Key extends keyof GenerateScenarioParams>(
    key: Key,
    value: GenerateScenarioParams[Key],
  ) => {
    setGeneratorParams((currentParams) => ({
      ...currentParams,
      [key]: value,
    }))
  }

  const submitGenerateScenario = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setGenerationError(null)
    setIsGenerating(true)

    try {
      const generatedScenario = await generateScenario(generatorParams)
      const uniqueScenario = ensureUniqueScenarioId(
        generatedScenario,
        allScenarios,
      )
      const nextGeneratedScenarios = [uniqueScenario, ...generatedScenarios]

      setGeneratedScenarios(nextGeneratedScenarios)
      saveGeneratedScenarios(nextGeneratedScenarios)
      setIsGeneratorOpen(false)
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : 'Unable to generate a scenario.',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#0a1628] px-6 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-sky-300">
              Pre-flight briefing
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-amber-400 sm:text-5xl">
              VFR-into-IMC Decision Trainer
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Aeronautical decision-making under pressure
            </p>
          </div>

          <button
            type="button"
            className="rounded-md border border-amber-300/40 bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-300"
            onClick={() => {
              setGenerationError(null)
              setIsGeneratorOpen(true)
            }}
          >
            Generate New Scenario
          </button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {generatedScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              isGenerated
              scenario={scenario}
              onDelete={deleteGeneratedScenario}
              onStart={startScenario}
            />
          ))}
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onStart={startScenario}
            />
          ))}
        </div>
      </div>

      {isGeneratorOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
          role="dialog"
        >
          <form
            className="w-full max-w-xl rounded-xl border border-amber-300/20 bg-[#07111f] p-6 shadow-2xl shadow-black/50"
            onSubmit={submitGenerateScenario}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-sky-300">
                  AI flight planning
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-amber-400">
                  Generate New Scenario
                </h2>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-700 px-2 py-1 font-mono text-xs text-slate-400 transition hover:border-slate-400 hover:text-white disabled:opacity-40"
                disabled={isGenerating}
                onClick={() => setIsGeneratorOpen(false)}
              >
                X
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                  Region
                </span>
                <select
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-amber-300"
                  disabled={isGenerating}
                  value={generatorParams.region}
                  onChange={(event) =>
                    updateGeneratorParam(
                      'region',
                      event.target.value as GenerateScenarioParams['region'],
                    )
                  }
                >
                  {regionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                  Difficulty
                </span>
                <select
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-amber-300"
                  disabled={isGenerating}
                  value={generatorParams.difficulty}
                  onChange={(event) =>
                    updateGeneratorParam(
                      'difficulty',
                      event.target
                        .value as GenerateScenarioParams['difficulty'],
                    )
                  }
                >
                  {difficultyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                  Failure Mode
                </span>
                <select
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-amber-300"
                  disabled={isGenerating}
                  value={generatorParams.failure_mode_preference}
                  onChange={(event) =>
                    updateGeneratorParam(
                      'failure_mode_preference',
                      event.target
                        .value as GenerateScenarioParams['failure_mode_preference'],
                    )
                  }
                >
                  {failureModeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {generationError ? (
              <div className="mt-5 rounded-md border border-red-400/40 bg-red-950/30 p-3 text-sm leading-6 text-red-100">
                {generationError}
              </div>
            ) : null}

            {isGenerating ? (
              <div className="mt-5 rounded-md border border-amber-400/30 bg-slate-950 p-4 text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
                  Generating scenario...
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-400 hover:text-white disabled:opacity-40"
                disabled={isGenerating}
                onClick={() => setIsGeneratorOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-70"
                disabled={isGenerating}
              >
                Generate
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  )
}
