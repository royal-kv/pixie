import type { IntakeAgentResult, RemixAgentResult, SuggestionAgentResult } from '../types';

/** When true, every agent call is skipped in favor of hardcoded fixtures under public/fixtures/
 * — see public/fixtures/README.md for the exact files/shapes expected. */
export const USE_MOCK_DATA =
  (import.meta.env.VITE_USE_MOCK_DATA ?? 'false').toLowerCase() === 'true';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Mock fixture missing: ${path} (HTTP ${res.status}). Add it under public${path}.`);
  }
  return res.json() as Promise<T>;
}

async function fetchText(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Mock fixture missing: ${path} (HTTP ${res.status}). Add it under public${path}.`);
  }
  return res.text();
}

export function loadMockIntake(): Promise<IntakeAgentResult> {
  return fetchJson('/fixtures/intake.json');
}

export function loadMockSuggestions(): Promise<SuggestionAgentResult> {
  return fetchJson('/fixtures/concepts.json');
}

export function loadMockRemix(): Promise<RemixAgentResult> {
  return fetchJson('/fixtures/remix.json');
}

/** File name must match the concept's `id` field exactly, e.g. concept-1 -> games/concept-1.html */
export function loadMockGameHtml(conceptId: string): Promise<string> {
  return fetchText(`/fixtures/games/${conceptId}.html`);
}
