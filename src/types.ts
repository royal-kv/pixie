export type Stage =
  | 'intake'
  | 'concepts_ready'
  | 'games_ready'
  | 'iterating'
  | 'finalized';

export interface BrandBrief {
  brand_name?: string;
  industry?: string;
  product_or_service?: string;
  tagline?: string;
  logo_url?: string;
  product_image_url?: string;
  brand_colors?: string[];
  fonts?: string[];
  cta_url?: string;
  social_links?: Record<string, string>;
  tone?: string;
  marketing_goal?: string;
  target_audience?: string;
  distribution_channels?: string;
  constraints?: string;
  low_confidence_notes?: string[];
  sources?: string[];
}

export type BuildComplexity = 'low' | 'medium' | 'high';

export interface Concept {
  id: string;
  title: string;
  genre: string;
  one_line_pitch: string;
  core_loop: string[];
  spatial_design: string;
  brand_integration: string;
  conversion_mechanic: string;
  marketing_alignment: string;
  session_length_estimate: string;
  build_complexity: BuildComplexity;
  shareability_hook: string;
  visual_style_direction: string;
  cta_placement: string;
  /** Present only on remix output rounds. */
  assumptions?: string[];
}

export interface Game {
  conceptId: string;
  html: string;
  createdAt: number;
}

export type ChatMessageKind = 'text' | 'concepts' | 'final';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
  kind?: ChatMessageKind;
  /** Concept ids to render as playable game cards, for kind 'concepts' | 'final'. */
  conceptIds?: string[];
}

export type GameEventType = 'view' | 'play' | 'conversion';

export interface GameEvent {
  gameId: string;
  type: GameEventType;
  payload?: unknown;
  ts: number;
}

export interface Session {
  id: string;
  stage: Stage;
  chatMessages: ChatMessage[];
  brandBrief: BrandBrief;
  assets: { logoDataUrl?: string; productImageDataUrl?: string };
  redemptionCodes: string[];
  concepts: Concept[];
  games: Game[];
  currentGameId?: string;
  finalGameId?: string;
  events: GameEvent[];
}

export function createEmptySession(id: string): Session {
  return {
    id,
    stage: 'intake',
    chatMessages: [],
    brandBrief: {},
    assets: {},
    redemptionCodes: [],
    concepts: [],
    games: [],
    events: [],
  };
}

// --- Agent response schemas ---

export interface IntakeAgentResult {
  extracted: {
    brand_name: string | null;
    industry: string | null;
    product_or_service: string | null;
    tagline: string | null;
    logo_url: string | null;
    product_image_url: string | null;
    brand_colors: string[];
    fonts: string[];
    cta_url: string | null;
    social_links: Record<string, string>;
  };
  tone: string;
  low_confidence_notes: string[];
  needs_user_input: {
    marketing_goal?: string;
    target_audience?: string;
    distribution_channels?: string;
    constraints?: string;
  };
  user_provided?: {
    marketing_goal?: string;
    target_audience?: string;
    distribution_channels?: string;
    constraints?: string;
  };
  sources: string[];
}

export interface SuggestionAgentResult {
  assumptions: string[];
  suggestions: Concept[];
}

export interface RemixAgentResult extends Concept {
  assumptions: string[];
}
