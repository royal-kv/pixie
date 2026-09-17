import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  onSignIn: (email: string, password: string) => void;
}

export default function LoginPage({ onSignIn }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter both an email and a password to continue.');
      return;
    }
    setError(null);
    onSignIn(email.trim(), password);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-black p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brand)] font-black text-[var(--brand-foreground)]">
            P
          </span>
          <span className="text-lg font-semibold tracking-tight">Pixie</span>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">
            AI Game Studio
          </p>
          <h2 className="max-w-md text-4xl font-black leading-tight tracking-tight">
            Turn a brand brief into a playable game in minutes.
          </h2>
          <p className="max-w-sm text-sm text-white/60">
            Chat with Pixie about your campaign, get three 3D mini-game concepts built and
            playable instantly, then remix them until one's ready to ship.
          </p>
        </div>
        <p className="text-xs text-white/40">Internal prototype — not for public release.</p>
      </div>

      <div className="flex items-center justify-center border-l border-border bg-background p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <div className="space-y-1 text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-2 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--brand)] font-black text-[var(--brand-foreground)]">
                P
              </span>
              <span className="text-lg font-semibold tracking-tight">Pixie</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">Sign in to your workspace.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full">
            Sign in
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Prototype login — any email and password will do.
          </p>
        </form>
      </div>
    </div>
  );
}
