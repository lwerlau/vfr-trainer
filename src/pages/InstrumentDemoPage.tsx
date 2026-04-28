import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Airspeed,
  Altimeter,
  AttitudeIndicator,
  HeadingIndicator,
  OutsideView,
} from '../components/instruments'

interface SliderControlProps {
  label: string
  min: number
  max: number
  step?: number
  unit?: string
  value: number
  onChange: (value: number) => void
}

function SliderControl({
  label,
  min,
  max,
  step = 1,
  unit = '',
  value,
  onChange,
}: SliderControlProps) {
  const handleValue = (
    event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>,
  ) => {
    onChange(Number(event.currentTarget.value))
  }

  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-amber-300">
          {value}
          {unit}
        </span>
      </div>
      <input
        className="w-full accent-amber-400"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleValue}
        onInput={handleValue}
      />
    </label>
  )
}

interface DemoCardProps {
  title: string
  children: React.ReactNode
  controls: React.ReactNode
}

function DemoCard({ title, children, controls }: DemoCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-black/20">
      <h2 className="mb-5 font-mono text-sm uppercase tracking-[0.2em] text-amber-300">
        {title}
      </h2>
      <div className="mx-auto flex h-56 w-full max-w-56 items-center justify-center">
        {children}
      </div>
      <div className="mt-6 space-y-4">{controls}</div>
    </article>
  )
}

export function InstrumentDemoPage() {
  const [pitch, setPitch] = useState(0)
  const [roll, setRoll] = useState(0)
  const [altitude, setAltitude] = useState(4500)
  const [heading, setHeading] = useState(270)
  const [airspeed, setAirspeed] = useState(105)
  const [visibility, setVisibility] = useState(8)
  const [ceiling, setCeiling] = useState(4500)

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#0a1628] px-6 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-sky-300">
            Development preview
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-amber-400">
            Instrument Panel Components
          </h1>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <DemoCard
            title="Attitude Indicator"
            controls={
              <>
                <SliderControl
                  label="Pitch"
                  min={-30}
                  max={30}
                  unit=" deg"
                  value={pitch}
                  onChange={setPitch}
                />
                <SliderControl
                  label="Roll"
                  min={-60}
                  max={60}
                  unit=" deg"
                  value={roll}
                  onChange={setRoll}
                />
              </>
            }
          >
            <AttitudeIndicator pitch={pitch} roll={roll} />
          </DemoCard>

          <DemoCard
            title="Altimeter"
            controls={
              <SliderControl
                label="Altitude"
                min={0}
                max={15000}
                step={100}
                unit=" ft"
                value={altitude}
                onChange={setAltitude}
              />
            }
          >
            <Altimeter altitude_ft={altitude} />
          </DemoCard>

          <DemoCard
            title="Heading Indicator"
            controls={
              <SliderControl
                label="Heading"
                min={0}
                max={359}
                unit=" deg"
                value={heading}
                onChange={setHeading}
              />
            }
          >
            <HeadingIndicator heading={heading} />
          </DemoCard>

          <DemoCard
            title="Airspeed"
            controls={
              <SliderControl
                label="Airspeed"
                min={0}
                max={180}
                unit=" kt"
                value={airspeed}
                onChange={setAirspeed}
              />
            }
          >
            <Airspeed airspeed_kts={airspeed} />
          </DemoCard>

          <DemoCard
            title="Outside View"
            controls={
              <>
                <SliderControl
                  label="Visibility"
                  min={0}
                  max={10}
                  step={0.1}
                  unit=" sm"
                  value={visibility}
                  onChange={setVisibility}
                />
                <SliderControl
                  label="Ceiling"
                  min={0}
                  max={10000}
                  step={100}
                  unit=" ft"
                  value={ceiling}
                  onChange={setCeiling}
                />
              </>
            }
          >
            <OutsideView visibility_sm={visibility} ceiling_ft={ceiling} />
          </DemoCard>
        </div>
      </div>
    </section>
  )
}
