# Pixie — AI Game Studio (Prototype)

A frontend-only prototype: sign in, chat with **Pixie** about a brand's campaign brief, get 3
AI-generated 3D mini-game concepts built and playable in-app, give feedback in chat to remix them,
and finalize one for embed/download. No backend — everything runs client-side and persists to
`localStorage`.

## ⚠️ Not production-safe

This calls AWS Bedrock's Runtime API **directly from the browser**, using a Bedrock API key as a
bearer token (no SigV4 signing). That means the key ships in the client bundle and is visible to
anyone who opens dev tools. This is fine for a local prototype; it is **not** something you
should deploy publicly. A real build would proxy these calls through a backend that holds the
key server-side. Login is also a prototype stub — any non-empty email/password signs in, there's
no real backend auth.

## Setup

```bash
npm install
cp .env.example .env   # then fill in VITE_AWS_BEDROCK_API_KEY (and region/model if needed)
npm run dev
```

### Mock data mode

Set `VITE_USE_MOCK_DATA=true` in `.env` to skip live Bedrock calls entirely and serve hardcoded
fixtures from `public/fixtures/` instead (3 concepts, their built game HTML, one remix round) —
see `public/fixtures/README.md`. A "Mock data mode" badge appears in the header when it's on.
Useful for UI iteration or demos without spending tokens or needing a working key.

If `npm run dev` fails with `EMFILE: too many open files` (a file-watcher/inotify limit issue
seen on some machines, unrelated to this app), either raise your inotify watch limits, or use
`npm run build && npm run preview` instead — that serves the production build without a file
watcher.

## How it works

- **Login** (`src/pages/LoginPage.tsx`) — prototype auth (`src/lib/auth.ts`); any email/password
  signs in and is stored in `localStorage`.
- **App shell** (`src/components/layout/AppShell.tsx`, `AppSidebar.tsx`) — a sidebar with
  **Dashboard** and **Create game** tabs, built on shadcn/ui's `Sidebar` primitives.
- **Dashboard** (`src/pages/DashboardPage.tsx`) — summary stats and a list of past campaigns
  (from a small session index kept in `localStorage`, see `src/lib/storage.ts`), each reopenable.
- **Create game** (`src/pages/CreateGamePage.tsx`) — the whole flow lives inside one chat thread:
  Pixie asks a short scripted sequence of questions (brand name, marketing goal, target
  audience/generation, distribution channel, optional constraints/redemption codes) that fill in
  a `BrandBrief` (`src/types.ts`). Once complete, the **Suggestion Agent** proposes 3 game
  concepts and the **Build Agent** builds all 3 in parallel into self-contained HTML files, shown
  as playable cards (`src/components/chat/GameCard.tsx`, sandboxed `<iframe>` via
  `src/components/GameFrame.tsx`) right in the chat. Freeform feedback typed in chat (e.g. "I like
  the theme of the first one and the pace of the second") goes to the **Remix Agent**, which
  merges the praised attributes into a new concept that gets built and appended as a new round —
  every prior round stays scrollable in the chat history. Tapping **Finalize** on any card locks
  it in and reveals a card with a copyable `<iframe>` embed snippet and a "Download standalone
  HTML" button.

The 4 agent system prompts live verbatim under `src/prompts/`; `src/lib/agents.ts` wraps each one
into a typed function, branching to mock fixtures when mock mode is on, and
`src/lib/bedrockClient.ts` holds the raw Bedrock Runtime `fetch` call.

## Events / analytics

Every embedded game (`src/components/GameFrame.tsx`) logs a `view` event on load and a
`conversion` event whenever the game's own HTML posts `{ type: 'game-conversion', ... }` via
`window.parent.postMessage` (the mechanism the Build Agent's prompt requires for its conversion
payoff). These land in `session.events` and roll up into the Dashboard's "Events logged" stat.

## Redemption codes

The source agent prompts don't have a slot for real coupon codes — only a description of *how* a
reward is presented. `redemptionCodes: string[]` is collected in the chat intake and passed into
the Build Agent's brief; its prompt explicitly requires using a real code (not an invented
placeholder) for the conversion payoff whenever the list is non-empty.
