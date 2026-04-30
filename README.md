# VFR Trainer

VFR Trainer is an AI-powered aeronautical decision-making simulator for student and private pilots. It presents compressed VFR-into-IMC scenarios where weather deteriorates quickly, cockpit workload rises, and the pilot must decide whether to continue, turn around, divert, declare an emergency, or request pop-up IFR.

The goal is judgment training, not stick-and-rudder fidelity. The simulator makes the weather trend visible, forces a time-sensitive decision, and then grades the outcome with an AI examiner using aviation decision-making frameworks.

## Safety Motivation

Continued VFR flight into instrument meteorological conditions is one of the deadliest general aviation accident patterns. These accidents often do not begin with one dramatic failure. They begin with plan continuation bias, marginal weather, terrain or fuel pressure, and a delayed decision while options quietly disappear.

VFR Trainer lets pilots rehearse that moment before it happens in the real world.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- OpenAI GPT-4o and GPT-4o mini
- Zod runtime validation
- React Router

## Features

- Five curated scenarios based on common VFR-into-IMC accident patterns
- AI scenario generation by region, pilot experience, and failure mode
- Live cockpit instruments: attitude indicator, altimeter, heading indicator, airspeed indicator, and outside windscreen view
- IMC disorientation mechanic that can lead to loss of control if the pilot does not use the attitude indicator
- AI examiner debriefs graded against FAA PAVE and 5P frameworks
- Rule-based fallback grader when the OpenAI API key is unavailable
- Scenario persistence for generated flights using localStorage
- 60-second compressed demo timeline for public demos

## Getting Started

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Add your OpenAI API key:

```bash
VITE_OPENAI_API_KEY=sk-your-key-here
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Environment Variables

`VITE_OPENAI_API_KEY` is required for AI scenario generation and AI examiner grading.

If the key is missing, debrief grading falls back to a deterministic rule-based assessment so the demo still works. AI scenario generation requires the key.

## Deploying To Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add `VITE_OPENAI_API_KEY` in the Vercel project environment variables.
4. Deploy.

The included `vercel.json` rewrites all routes to `index.html` so React Router works on direct visits and browser refreshes.

## Aviation Frameworks And Data Sources

The grading and scenario design are inspired by FAA aeronautical decision-making frameworks:

- PAVE: Pilot, Aircraft, enVironment, External pressures
- 5P: Plan, Plane, Pilot, Passengers, Programming
- DECIDE: Detect, Estimate, Choose, Identify, Do, Evaluate

Scenario patterns are based on recurring NTSB accident-data themes such as scud running, marginal VFR continuation, night VFR deterioration, fuel pressure, terrain compression, and delayed ATC assistance.

## Disclaimer

VFR Trainer is a training and demonstration tool only. It is not a certified flight simulator, flight training device, weather product, navigation tool, or flight-planning tool. Do not use it for actual flight planning or operational decision-making.

## Future Roadmap

- In-flight map view with aircraft position
- Pre-flight briefing cards
- Multi-decision scenarios
- Audio cues including engine, ATIS, rain, stall horn, and cockpit warnings
- Voice-based ATC interaction
- Replay system for debrief review

## Repository

[https://github.com/lwerlau/vfr-trainer](https://github.com/lwerlau/vfr-trainer)
