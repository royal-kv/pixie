import { useCallback, useState } from 'react';
import * as auth from '../lib/auth';
import type { AuthUser } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => auth.getCurrentUser());

  const signIn = useCallback((email: string, password: string) => {
    setUser(auth.login(email, password));
  }, []);

  const signOut = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  return { user, signIn, signOut };
}
