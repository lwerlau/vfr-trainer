import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Realistic Scenarios',
    body: 'Curated accident-pattern lessons and AI-generated weather traps.',
  },
  {
    title: 'Live Cockpit Instruments',
    body: 'Airspeed, altitude, heading, attitude, and a degrading outside view.',
  },
  {
    title: 'AI Examiner Debriefs',
    body: 'Post-flight grading against FAA decision-making frameworks.',
  },
]

export function LandingPage() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#06101f] px-5 py-12 text-slate-100 sm:px-6 lg:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#07111f_0%,#0a1628_46%,#172033_47%,#060b13_100%)]" />
        <div className="absolute inset-x-0 top-[46%] h-px bg-amber-200/20" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.14),transparent_34%),linear-gradient(to_bottom,rgba(2,6,23,0),rgba(2,6,23,0.92))]" />
        <div className="absolute bottom-[-16%] left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full border border-amber-300/10 bg-black/35 shadow-[0_0_90px_rgba(251,191,36,0.08)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col justify-between gap-12">
        <main className="max-w-3xl pt-8 sm:pt-16">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-sky-200">
            AI-powered aeronautical decision-making simulator
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-normal text-amber-400 sm:text-7xl">
            VFR Trainer
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Train your judgment under deteriorating weather conditions. Make
            the call. Get graded by an AI examiner.
          </p>

          <Link
            className="mt-9 inline-flex min-h-14 w-full items-center justify-center rounded-md bg-amber-400 px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-amber-950/30 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:w-auto"
            to="/setup"
          >
            Start Training
          </Link>
        </main>

        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <article
              className="rounded-lg border border-white/10 bg-slate-950/70 p-4 backdrop-blur"
              key={feature.title}
            >
              <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-amber-300">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {feature.body}
              </p>
            </article>
          ))}
        </div>

        <footer className="flex flex-col gap-2 border-t border-white/10 pt-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Built for the OpenAI Codex Creator Challenge</span>
          <a
            className="font-mono text-amber-300 transition hover:text-amber-200"
            href="https://github.com/lwerlau/vfr-trainer"
            rel="noreferrer"
            target="_blank"
          >
            GitHub repo
          </a>
        </footer>
      </div>
    </section>
  )
}
