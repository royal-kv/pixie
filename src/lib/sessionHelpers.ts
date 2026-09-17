import type { ChatMessage, ChatMessageKind, GameEvent, GameEventType, Session } from '../types';

export function appendChatMessage(
  session: Session,
  role: ChatMessage['role'],
  content: string,
  opts?: { kind?: ChatMessageKind; conceptIds?: string[] },
): Session {
  return {
    ...session,
    chatMessages: [
      ...session.chatMessages,
      { role, content, ts: Date.now(), kind: opts?.kind, conceptIds: opts?.conceptIds },
    ],
  };
}

export function logGameEvent(
  session: Session,
  gameId: string,
  type: GameEventType,
  payload?: unknown,
): Session {
  const event: GameEvent = { gameId, type, payload, ts: Date.now() };
  return { ...session, events: [...session.events, event] };
}
