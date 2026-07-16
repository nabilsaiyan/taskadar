<div align="center">

# Taskadar

**AI-powered local-services marketplace — describe what you need, get matched to the right pro.**

Instead of browsing categories and filters, you type your task in plain language
("a birthday cake delivered tomorrow afternoon") and an AI layer parses the request
and ranks the local providers who can help. One codebase runs on **iOS, Android, and web**.

[Live Demo](https://taskadar.vercel.app) · [Report an issue](https://github.com/nabilsaiyan/taskadar/issues)

![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![Platforms](https://img.shields.io/badge/iOS%20·%20Android%20·%20Web-single%20codebase-6b4eff)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Features

- **Natural-language search** — describe the job in your own words; no category trees or filters
- **AI matching** — the model extracts intent, timing and keywords, then returns ranked providers with a friendly summary
- **Bring your own key** — Gemini 2.5 Flash (free tier), Claude Opus 4.8, or GPT-4o mini; pick a provider and paste your key
- **Graceful fallback** — a built-in keyword matcher runs when no key is set or a call fails, so the demo always works
- **Full buyer flow** — search → ranked results → provider profile → booking confirmation, with the AI match recapped at the end
- **Two-sided marketplace** — a seller screen to publish a listing that becomes instantly searchable on the buyer side
- **Privacy-first** — keys are stored on-device only (AsyncStorage / `localStorage` on web) and sent directly to the provider, never to a server
- **Polished & fast** — warm design system, Reanimated micro-interactions, web hover states, image prefetching

## Architecture

```
app/                          Expo Router routes (file-based)
├── _layout.tsx               Root stack, providers, key hydration
├── (tabs)/
│   ├── _layout.tsx           Find / Provide tab bar
│   ├── index.tsx             Home — natural-language search
│   └── sell.tsx              Seller — publish a listing
├── results.tsx               AI results — loading, summary, ranked cards
├── provider/[id].tsx         Provider profile
├── booking.tsx               Booking confirmation
├── settings.tsx              AI provider / API-key management
└── +not-found.tsx
src/
├── components/               Shared UI (Button, Chip, ProviderCard, Avatar, AiThinking…)
├── data/                     Domain types + mock provider catalogue
├── services/
│   ├── api.ts                Async data layer — swap-in ready for a real backend
│   ├── ai.ts                 Local keyword matcher (mock fallback)
│   ├── aiClient.ts           Direct multi-provider model calls (BYOK)
│   └── aiConfig.ts           Provider / model registry
├── store/
│   ├── providerStore.ts      In-memory catalogue (buyer + seller share it)
│   └── apiKeyStore.ts        Local, persisted API-key state
└── theme/                    Design tokens + cross-platform style helpers
```

**Key decisions:**

- **One codebase, three platforms.** Only standard React Native components and Expo modules with documented iOS + Android + web support — the web build is a static export deployable anywhere.
- **Two matching engines behind one interface.** `searchProviders()` calls a real model when a key is configured and falls back to the local matcher otherwise. Screens consume a single `AiSearchResult` shape and never know which engine ran.
- **BYOK, client-side.** There is no backend, so there is no server key to leak. The user provides their own; it stays on-device and goes straight to the chosen provider (Anthropic browser calls use the documented direct-browser-access header for CORS).
- **Backend-ready data layer.** Everything routes through `services/api.ts` (async, latency-simulated, API-shaped) — going live means changing only those function bodies, no UI edits.
- **Animations that export cleanly.** Reanimated for UI-thread animations across all platforms, with `react-native-worklets` pinned to the version Expo Go ships.

## Getting Started

```bash
git clone https://github.com/nabilsaiyan/taskadar.git
cd taskadar
npm install
```

**Mobile (Expo Go):**

```bash
npx expo start        # scan the QR code with Expo Go (iOS / Android)
```

**Web (browser):**

```bash
npx expo start --web  # opens http://localhost:8081
```

The app works out of the box with the built-in demo matcher. To use a real model,
open the **AI provider** screen (the pill in the top-right of Home) and paste a key.

### AI providers

| Provider | Model             | Get a key                                                        |
| -------- | ----------------- | ---------------------------------------------------------------- |
| Gemini   | `gemini-2.5-flash` | Free at [aistudio.google.com](https://aistudio.google.com/apikey) |
| Claude   | `claude-opus-4-8`  | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| OpenAI   | `gpt-4o-mini`      | [platform.openai.com](https://platform.openai.com/api-keys)      |

Keys are stored only on your device and sent directly to the provider.

## Scripts

| Command                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm start`            | Start the Expo dev server                      |
| `npm run web`          | Start the web dev server                       |
| `npm run android`      | Open on Android                                |
| `npm run ios`          | Open on iOS                                     |
| `npm run export:web`   | Static web export to `dist/`                   |
| `npx tsc --noEmit`     | TypeScript strict check                        |

## Tech Stack

Expo SDK 54 · React Native 0.81 · React 19 · TypeScript (strict) · Expo Router ·
React Native Reanimated · expo-image · expo-linear-gradient · AsyncStorage ·
Gemini / Claude / OpenAI REST APIs

## Customizing branding & imagery

**Provider logos** — the Gemini / Claude / OpenAI marks in the AI pill and the
settings screen render from `assets/logos/{gemini,claude,openai}.svg`. The files
shipped here are simple placeholders; drop the official logo SVGs in with the
same filenames and they render automatically (no code changes — powered by
`react-native-svg-transformer`, configured in `metro.config.js`).

**Provider images** — provider cards and profiles show a clean, on-brand
category placeholder (a category-colored tile with the trade's icon). To use a
real photo for a provider, set its `image` field in `src/data/providers.ts` to
an image URL (or a local `require(...)`) — it renders over the placeholder, and
the placeholder remains the fallback if the image is missing. Use your own vetted
photography or AI-generated art so imagery stays appropriate and on-brand.

## Deployment

The web build is a static SPA. A `vercel.json` is included with the correct build
command, output directory and SPA rewrite:

```bash
npm run export:web    # → dist/
```

Import the repo into Vercel and it deploys with zero config. For the AI features,
each visitor supplies their own key in the app — there are no server-side secrets
to configure.

## License

MIT © [Nabil Amhaouch](https://nabilamhaouch.dev)
