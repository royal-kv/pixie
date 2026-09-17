import { Trophy } from 'lucide-react';
import type { Concept, Game, GameEventType } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GameFrame from '@/components/GameFrame';
import LoadingDots from './LoadingDots';

interface Props {
  concept: Concept;
  game?: Game;
  isFinal: boolean;
  onFinalize: () => void;
  onEvent: (type: GameEventType, payload?: unknown) => void;
}

export default function GameCard({ concept, game, isFinal, onFinalize, onEvent }: Props) {
  return (
    <Card className="w-full max-w-72 shrink-0 gap-3 py-4">
      <CardHeader className="gap-1 px-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{concept.title}</CardTitle>
          {isFinal && (
            <Badge className="gap-1 bg-[var(--brand)] text-[var(--brand-foreground)]">
              <Trophy className="size-3" /> Final
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">{concept.genre}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="aspect-9/16 w-full overflow-hidden rounded-md border bg-black">
          {game ? (
            <GameFrame html={game.html} gameId={game.conceptId} onEvent={onEvent} className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <LoadingDots />
              <span className="text-[11px]">Building game…</span>
            </div>
          )}
        </div>
        <p className="line-clamp-3 text-xs text-muted-foreground">{concept.one_line_pitch}</p>
      </CardContent>
      {!isFinal && (
        <CardFooter className="px-4">
          <Button size="sm" variant="outline" className="w-full" disabled={!game} onClick={onFinalize}>
            Finalize
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
