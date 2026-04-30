import type { Scenario } from '../types/scenario'

interface PreFlightBriefingProps {
  scenario: Scenario
  onBegin: () => void
  onCancel: () => void
}

const pilotExperienceLabels: Record<Scenario['pilot_experience'], string> = {
  student: 'Student Pilot',
  private_vfr: 'Private Pilot, VFR',
  private_ifr_current: 'Private Pilot, IFR Current',
}

const decisionOptionsByExperience: Record<
  Scenario['pilot_experience'],
  string[]
> = {
  student: ['Continue', 'Turn 180', 'Divert', 'Declare Emergency'],
  private_vfr: ['Continue', 'Turn 180', 'Divert', 'Declare Emergency'],
  private_ifr_current: [
    'Continue',
    'Turn 180',
    'Divert',
    'Declare Emergency',
    'Request Pop-up IFR clearance',
  ],
}

const cloudDescriptions: Record<string, string> = {
  FEW: 'few clouds',
  SCT: 'scattered clouds',
  BKN: 'broken clouds',
  OVC: 'overcast',
}

function parseSignedTemperature(value: string) {
  return Number(value.replace('M', '-'))
}

function formatVisibility(visibilityToken: string) {
  return visibilityToken.replace('SM', ' statute miles visibility')
}

function interpretMetar(metar: string) {
  const tokens = metar.trim().split(/\s+/)
  const wind = tokens.find((token) =>
    /^(?:\d{3}|VRB)\d{2,3}(?:G\d{2,3})?KT$/.test(token),
  )
  const visibilityIndex = tokens.findIndex((token) => token.endsWith('SM'))
  const visibility =
    visibilityIndex > 0 &&
    /^\d+$/.test(tokens[visibilityIndex - 1]) &&
    /^\d\/\dSM$/.test(tokens[visibilityIndex])
      ? `${tokens[visibilityIndex - 1]} ${tokens[visibilityIndex]}`
      : tokens[visibilityIndex]
  const clouds = tokens.filter((token) =>
    /^(?:SKC|CLR|FEW|SCT|BKN|OVC)\d{0,3}$/.test(token),
  )
  const temperature = tokens.find((token) => /^M?\d{2}\/M?\d{2}$/.test(token))
  const altimeter = tokens.find((token) => /^A\d{4}$/.test(token))

  if (!wind || !visibility || clouds.length === 0 || !temperature || !altimeter) {
    return metar
  }

  const windMatch = wind.match(/^(\d{3}|VRB)(\d{2,3})(G(\d{2,3}))?KT$/)
  const [tempToken, dewpointToken] = temperature.split('/')
  const altimeterMatch = altimeter.match(/^A(\d{2})(\d{2})$/)

  if (!windMatch || !tempToken || !dewpointToken || !altimeterMatch) {
    return metar
  }

  const windDirection =
    windMatch[1] === 'VRB' ? 'variable' : `${Number(windMatch[1])}`
  const windText =
    windDirection === 'variable'
      ? `Wind variable at ${Number(windMatch[2])} knots`
      : `Wind ${windDirection} at ${Number(windMatch[2])} knots`
  const gustText = windMatch[4] ? ` gusting ${Number(windMatch[4])}` : ''
  const cloudText = clouds
    .map((cloud) => {
      if (cloud === 'SKC' || cloud === 'CLR') {
        return 'clear skies'
      }

      const match = cloud.match(/^(FEW|SCT|BKN|OVC)(\d{3})$/)

      if (!match) {
        return cloud
      }

      return `${cloudDescriptions[match[1]]} at ${Number(match[2]) * 100} feet`
    })
    .join(', ')
  const altimeterText = `${altimeterMatch[1]}.${altimeterMatch[2]}`

  return `${windText}${gustText}, ${formatVisibility(
    visibility,
  )}, ${cloudText}, temperature ${parseSignedTemperature(
    tempToken,
  )}°C dewpoint ${parseSignedTemperature(
    dewpointToken,
  )}°C, altimeter ${altimeterText}.`
}

function buildMissionBrief(scenario: Scenario) {
  return `You are en route from ${scenario.departure.icao} to ${scenario.destination.icao}. Conditions appear manageable at departure, but the scenario trap is that ${scenario.failure_mode.toLowerCase()} Maintain situational awareness, monitor the trend, and make a sound decision before options close.`
}

export function PreFlightBriefing({
  scenario,
  onBegin,
  onCancel,
}: PreFlightBriefingProps) {
  const initialMetar =
    scenario.departure.current_metar ?? scenario.states[0]?.weather.metar ?? ''
  const decisionOptions = decisionOptionsByExperience[scenario.pilot_experience]

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 py-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-xl border border-amber-300/20 bg-[#07111f] shadow-2xl shadow-black/60">
        <div className="border-b border-white/10 px-5 py-5 sm:px-7">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-sky-300">
            Pre-flight briefing
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-amber-400 sm:text-4xl">
            {scenario.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {scenario.failure_mode}
          </p>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:px-7">
          <section className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-amber-300">
              Flight Plan
            </h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500">
                  Departure
                </dt>
                <dd className="mt-1 text-slate-100">
                  <span className="font-mono text-amber-200">
                    {scenario.departure.icao}
                  </span>{' '}
                  {scenario.departure.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500">
                  Destination
                </dt>
                <dd className="mt-1 text-slate-100">
                  <span className="font-mono text-amber-200">
                    {scenario.destination.icao}
                  </span>{' '}
                  {scenario.destination.name}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-widest text-slate-500">
                  Route
                </dt>
                <dd className="mt-1 font-mono text-lg text-amber-300">
                  {scenario.departure.icao} &rarr; {scenario.destination.icao}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500">
                  Aircraft
                </dt>
                <dd className="mt-1 text-slate-100">{scenario.aircraft}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500">
                  Pilot
                </dt>
                <dd className="mt-1 text-slate-100">
                  {pilotExperienceLabels[scenario.pilot_experience]}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-amber-300">
              Initial Conditions
            </h2>
            <p className="mt-4 rounded-md border border-slate-700 bg-black px-3 py-3 font-mono text-xs leading-5 text-emerald-300">
              {initialMetar}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {interpretMetar(initialMetar)}
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-amber-300">
              Decision Authority
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {decisionOptions.map((option) => (
                <span
                  className="rounded-md border border-amber-300/25 bg-amber-300/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-amber-100"
                  key={option}
                >
                  {option}
                  {option.includes('IFR') ? (
                    <span className="ml-2 text-slate-400">
                      (IFR-current pilots only)
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-amber-300">
              Mission Brief
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {buildMissionBrief(scenario)}
            </p>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
          <button
            className="rounded-md border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-300 hover:text-white"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
            type="button"
            onClick={onBegin}
          >
            Begin Flight
          </button>
        </div>
      </div>
    </div>
  )
}
