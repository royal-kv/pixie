const REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';
const API_KEY = import.meta.env.VITE_AWS_BEDROCK_API_KEY as string | undefined;

// Defaults to a small/cheap/fast model so early wiring and testing doesn't burn through tokens.
// Bump this via .env once the pipeline works and you want higher-fidelity output.
export const MODEL_ID =
  (import.meta.env.VITE_BEDROCK_MODEL_ID as string) || 'anthropic.claude-3-5-haiku-20241022-v1:0';

function invokeUrl(modelId: string): string {
  return `https://bedrock-runtime.${REGION}.amazonaws.com/model/${encodeURIComponent(modelId)}/invoke`;
}

interface BedrockAnthropicResponse {
  content?: { type: string; text?: string }[];
}

/**
 * Calls a Claude model on AWS Bedrock via the Bedrock Runtime InvokeModel API, using a Bedrock
 * API key as a bearer token (no SigV4 signing needed). This still runs directly from the
 * browser for this prototype — see README's "Not production-safe" section.
 */
export async function callAgent(
  system: string,
  userContent: string,
  maxTokens = 4096,
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      'Missing VITE_AWS_BEDROCK_API_KEY. Add it to a .env file at the project root (see .env.example).',
    );
  }
  const response = await fetch(invokeUrl(MODEL_ID), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Bedrock request failed (${response.status}): ${errText || response.statusText}`);
  }

  const data = (await response.json()) as BedrockAnthropicResponse;
  const block = data.content?.[0];
  if (!block || block.type !== 'text' || !block.text) {
    throw new Error('Unexpected response shape from Bedrock');
  }
  return block.text;
}

/** Strips accidental markdown fences and parses the agent's JSON-only response. */
export function parseJsonResponse<T>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '');
  }
  return JSON.parse(cleaned.trim()) as T;
}

/** Strips accidental markdown fences from a raw-HTML agent response. */
export function cleanHtmlResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:html)?\s*/, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}
