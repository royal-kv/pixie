const AUTH_KEY = 'pixie:auth';

export interface AuthUser {
  email: string;
}

/** Prototype-only auth: no backend, any non-empty email/password combination signs in. */
export function login(email: string, _password: string): AuthUser {
  const user: AuthUser = { email };
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to persist auth state', err);
  }
  return user;
}

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (err) {
    console.error('Failed to clear auth state', err);
  }
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch (err) {
    console.error('Failed to read auth state', err);
    return null;
  }
}
