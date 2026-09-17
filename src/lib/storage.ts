import type { Session } from '../types';

const KEY_PREFIX = 'session:';
const CURRENT_SESSION_KEY = 'pixie:currentSessionId';
const INDEX_KEY = 'pixie:sessionIndex';

export interface SessionSummary {
  id: string;
  brandName?: string;
  stage: Session['stage'];
  updatedAt: number;
  gameCount: number;
  eventCount: number;
}

export function loadSession(id: string): Session | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch (err) {
    console.error('Failed to load session from localStorage', err);
    return null;
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(KEY_PREFIX + session.id, JSON.stringify(session));
    updateSessionIndex(session);
  } catch (err) {
    console.error('Failed to save session to localStorage', err);
  }
}

function updateSessionIndex(session: Session): void {
  const summary: SessionSummary = {
    id: session.id,
    brandName: session.brandBrief.brand_name,
    stage: session.stage,
    updatedAt: Date.now(),
    gameCount: session.games.length,
    eventCount: session.events.length,
  };
  const index = loadSessionIndex().filter((s) => s.id !== session.id);
  index.push(summary);
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function loadSessionIndex(): SessionSummary[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as SessionSummary[]) : [];
  } catch (err) {
    console.error('Failed to load session index from localStorage', err);
    return [];
  }
}

export function getOrCreateCurrentSessionId(): string {
  try {
    const existing = localStorage.getItem(CURRENT_SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(CURRENT_SESSION_KEY, id);
    return id;
  } catch (err) {
    console.error('localStorage unavailable, using ephemeral session id', err);
    return crypto.randomUUID();
  }
}

export function setCurrentSessionId(id: string): void {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, id);
  } catch (err) {
    console.error('Failed to persist current session id', err);
  }
}
