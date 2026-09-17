import { callAgent, parseJsonResponse, cleanHtmlResponse } from './bedrockClient';
import {
  USE_MOCK_DATA,
  loadMockIntake,
  loadMockSuggestions,
  loadMockGameHtml,
  loadMockRemix,
} from './mockData';
import { INTAKE_AGENT_PROMPT } from '../prompts/intakeAgent';
import { SUGGESTION_AGENT_PROMPT } from '../prompts/suggestionAgent';
import { BUILD_AGENT_PROMPT } from '../prompts/buildAgent';
import { REMIX_AGENT_PROMPT } from '../prompts/remixAgent';
import type {
  BrandBrief,
  Concept,
  IntakeAgentResult,
  SuggestionAgentResult,
  RemixAgentResult,
} from '../types';

export type EffectiveBrief = BrandBrief & { redemption_codes?: string[] };

export async function runIntakeAgent(params: {
  url: string;
  pageContent: string;
  userNotes?: string;
}): Promise<IntakeAgentResult> {
  if (USE_MOCK_DATA) return loadMockIntake();
  const { url, pageContent, userNotes } = params;
  const userMessage = [
    `Website URL: ${url}`,
    userNotes ? `User's original message / notes alongside the URL:\n${userNotes}` : '',
    `Fetched page content (markup, possibly truncated):\n${pageContent.slice(0, 15000)}`,
  ]
    .filter(Boolean)
    .join('\n\n');
  const text = await callAgent(INTAKE_AGENT_PROMPT, userMessage, 2048);
  return parseJsonResponse<IntakeAgentResult>(text);
}

export async function runSuggestionAgent(brief: EffectiveBrief): Promise<SuggestionAgentResult> {
  if (USE_MOCK_DATA) return loadMockSuggestions();
  const userMessage = `Brand brief:\n${JSON.stringify(brief, null, 2)}`;
  const text = await callAgent(SUGGESTION_AGENT_PROMPT, userMessage, 4096);
  return parseJsonResponse<SuggestionAgentResult>(text);
}

export async function runBuildAgent(params: {
  concept: Concept;
  brief: EffectiveBrief;
}): Promise<string> {
  const { concept, brief } = params;
  if (USE_MOCK_DATA) return loadMockGameHtml(concept.id);
  const userMessage = [
    `Concept:\n${JSON.stringify(concept, null, 2)}`,
    `Brand brief:\n${JSON.stringify(brief, null, 2)}`,
  ].join('\n\n');
  const text = await callAgent(BUILD_AGENT_PROMPT, userMessage, 16000);
  return cleanHtmlResponse(text);
}

function summarizeConceptForRemix(concept: Concept): string {
  return (
    `"${concept.title}" (${concept.genre}): ${concept.one_line_pitch} ` +
    `Spatial design: ${concept.spatial_design} ` +
    `Conversion mechanic: ${concept.conversion_mechanic} ` +
    `Session pacing: ${concept.session_length_estimate}.`
  );
}

export async function runRemixAgent(params: {
  priorConcepts: Concept[];
  feedback: string;
}): Promise<RemixAgentResult> {
  if (USE_MOCK_DATA) return loadMockRemix();
  const { priorConcepts, feedback } = params;
  const gameSummaries = priorConcepts.map((c) => ({
    id: c.id,
    summary: summarizeConceptForRemix(c),
  }));
  const userMessage = [
    `prior_concepts:\n${JSON.stringify(priorConcepts, null, 2)}`,
    `game_summaries:\n${JSON.stringify(gameSummaries, null, 2)}`,
    `feedback:\n${feedback}`,
  ].join('\n\n');
  const text = await callAgent(REMIX_AGENT_PROMPT, userMessage, 4096);
  return parseJsonResponse<RemixAgentResult>(text);
}
