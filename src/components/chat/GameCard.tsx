import { useState } from 'react';
import { Play, Trophy } from 'lucide-react';
import type { Concept, Game, GameEventType } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GameFrame from '@/components/GameFrame';

interface Props {
  concept: Concept;
  game?: Game;
  isFinal: boolean;
  onFinalize: () => void;
  onEvent: (type: GameEventType, payload?: unknown) => void;
}

export default function GameCard({ concept, game, isFinal, onFinalize, onEvent }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="w-64 shrink-0 gap-3 py-4">
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
      <CardContent className="px-4">
        <p className="line-clamp-3 text-xs text-muted-foreground">{concept.one_line_pitch}</p>
      </CardContent>
      <CardFooter className="flex gap-2 px-4">
        <Button
          size="sm"
          variant={game ? 'default' : 'secondary'}
          disabled={!game}
          className="flex-1 gap-1.5"
          onClick={() => setOpen(true)}
        >
          <Play className="size-3.5" />
          {game ? 'Play' : 'Building…'}
        </Button>
        {!isFinal && (
          <Button size="sm" variant="outline" disabled={!game} onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </CardFooter>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{concept.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-9/16 w-full overflow-hidden rounded-md border bg-black">
            {game && (
              <GameFrame
                html={game.html}
                gameId={game.conceptId}
                onEvent={onEvent}
                className="h-full w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
