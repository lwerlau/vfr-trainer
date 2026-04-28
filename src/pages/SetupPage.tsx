import { useNavigate } from 'react-router-dom'
import { scenarios } from '../data/scenarios'
import type { Scenario } from '../types/scenario'

const pilotExperienceLabels: Record<Scenario['pilot_experience'], string> = {
  student: 'Student Pilot',
  private_vfr: 'Private Pilot - VFR',
  private_ifr_current: 'Private Pilot - IFR Current',
}

function formatDuration(totalDurationSec: number) {
  return `${Math.round(totalDurationSec / 60)} min`
}

export function SetupPage() {
  const navigate = useNavigate()

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#0a1628] px-6 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-sky-300">
            Pre-flight briefing
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-amber-400 sm:text-5xl">
            VFR-into-IMC Decision Trainer
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Aeronautical decision-making under pressure
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {scenarios.map((scenario) => (
            <article
              key={scenario.id}
              className="flex min-h-[30rem] flex-col rounded-lg border border-white/10 bg-slate-900/95 p-6 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-amber-950/30"
            >
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
                onClick={() =>
                  navigate('/sim', { state: { scenarioId: scenario.id } })
                }
              >
                Start Flight
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
