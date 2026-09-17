# Mock fixtures

Used only when `VITE_USE_MOCK_DATA=true` (see `.env.example`). When enabled, every agent call is
skipped and the app reads from these static files instead — useful for UI work or demos without
spending Bedrock tokens or needing a working API key.

Files ship with small placeholder content (clearly labeled "FIXTURE PLACEHOLDER" on-screen) so the
wiring is demonstrably correct end to end. Replace them with real generated output as you get it.

- `intake.json` — one `IntakeAgentResult` (shape from `src/types.ts`), served when the user clicks
  "Analyze site" in the intake step, regardless of what URL/content they gave.
- `concepts.json` — one `SuggestionAgentResult` (`{ assumptions, suggestions: Concept[] }`),
  served when "Generate 3 game concepts" is clicked. Must contain exactly 3 concepts.
- `remix.json` — one `RemixAgentResult` (a single `Concept` + `assumptions`), served every time
  the user submits feedback to remix, regardless of what they typed.
- `games/<concept id>.html` — the actual playable game HTML for a given concept. **The file name
  must exactly match that concept's `id` field.** The 3 starter concepts use `concept-1`,
  `concept-2`, `concept-3`; the remix fixture uses `concept-remix-1`. If you add more remix
  rounds or change ids in the JSON fixtures, add a matching `games/<id>.html` file or the build
  step will 404.

There's no separate "final" fixture — finalizing just locks in whichever already-built game
(one of the concept or remix games above) the user picked in the Iterate step.
