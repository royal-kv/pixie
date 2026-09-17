import { useCallback, useEffect, useRef, useState } from 'react';
import { createEmptySession, type Session } from '../types';
import { getOrCreateCurrentSessionId, loadSession, saveSession, setCurrentSessionId } from '../lib/storage';

export function useSession() {
  const idRef = useRef(getOrCreateCurrentSessionId());
  const [session, setSession] = useState<Session>(
    () => loadSession(idRef.current) ?? createEmptySession(idRef.current),
  );

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const updateSession = useCallback((updater: (prev: Session) => Session) => {
    setSession((prev) => updater(prev));
  }, []);

  const resetSession = useCallback(() => {
    const newId = crypto.randomUUID();
    setCurrentSessionId(newId);
    idRef.current = newId;
    setSession(createEmptySession(newId));
  }, []);

  const openSession = useCallback((id: string) => {
    setCurrentSessionId(id);
    idRef.current = id;
    setSession(loadSession(id) ?? createEmptySession(id));
  }, []);

  return { session, updateSession, resetSession, openSession };
}
