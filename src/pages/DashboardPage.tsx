import { useMemo, useState, type ReactNode } from 'react';
import { Gamepad2, Plus, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { loadSessionIndex } from '@/lib/storage';
import type { Stage } from '@/types';

interface Props {
  onOpenSession: (id: string) => void;
  onNewGame: () => void;
}

const STAGE_LABEL: Record<Stage, string> = {
  intake: 'In progress',
  concepts_ready: 'Building',
  games_ready: 'Playable',
  iterating: 'Iterating',
  finalized: 'Finalized',
};

export default function DashboardPage({ onOpenSession, onNewGame }: Props) {
  const [sessions] = useState(() =>
    loadSessionIndex().sort((a, b) => b.updatedAt - a.updatedAt),
  );

  const stats = useMemo(
    () => ({
      totalSessions: sessions.length,
      totalGames: sessions.reduce((sum, s) => sum + s.gameCount, 0),
      totalEvents: sessions.reduce((sum, s) => sum + s.eventCount, 0),
      finalized: sessions.filter((s) => s.stage === 'finalized').length,
    }),
    [sessions],
  );

  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
            <p className="text-sm text-muted-foreground">All the games Pixie has helped you ship.</p>
          </div>
          <Button onClick={onNewGame} className="gap-1.5">
            <Plus className="size-4" /> New game
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={<Sparkles className="size-4" />} label="Campaigns" value={stats.totalSessions} />
          <StatCard icon={<Gamepad2 className="size-4" />} label="Games built" value={stats.totalGames} />
          <StatCard icon={<Activity className="size-4" />} label="Events logged" value={stats.totalEvents} />
          <StatCard
            icon={<Badge className="size-4 rounded-full bg-[var(--brand)] p-0" />}
            label="Finalized"
            value={stats.finalized}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Campaigns</h3>
          {sessions.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              No campaigns yet — start a chat with Pixie to build your first one.
            </Card>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onOpenSession(s.id)}
                  className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.brandName || 'Untitled campaign'}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.gameCount} game{s.gameCount === 1 ? '' : 's'} · updated{' '}
                      {new Date(s.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={s.stage === 'finalized' ? 'default' : 'secondary'}>
                    {STAGE_LABEL[s.stage]}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Card className="gap-1 py-4">
      <CardHeader className="flex-row items-center gap-2 px-4">
        <span className="text-muted-foreground">{icon}</span>
        <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
