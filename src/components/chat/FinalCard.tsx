import { useMemo, useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import type { Concept, Game, GameEventType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import GameFrame from '@/components/GameFrame';

interface Props {
  concept: Concept;
  game: Game;
  onEvent: (type: GameEventType, payload?: unknown) => void;
}

export default function FinalCard({ concept, game, onEvent }: Props) {
  const [copied, setCopied] = useState(false);

  const embedSnippet = useMemo(() => {
    const escaped = game.html.replace(/"/g, '&quot;');
    return `<iframe sandbox="allow-scripts" srcdoc="${escaped}" style="width:100%;aspect-ratio:9/16;border:0;" title="${concept.title}"></iframe>`;
  }, [game.html, concept.title]);

  function handleDownload() {
    const blob = new Blob([game.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${concept.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Clipboard write failed', err);
    }
  }

  return (
    <Card className="w-full max-w-xl gap-4 py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">{concept.title} — ready to ship 🎉</CardTitle>
        <p className="text-xs text-muted-foreground">{concept.one_line_pitch}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
        <div className="aspect-9/16 max-h-72 w-full overflow-hidden rounded-md border bg-black justify-self-center">
          <GameFrame html={game.html} gameId={game.conceptId} onEvent={onEvent} className="h-full w-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={handleDownload} className="gap-1.5">
            <Download className="size-4" /> Download standalone HTML
          </Button>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Embed snippet</span>
              <Button size="sm" variant="ghost" className="h-6 gap-1 px-1.5 text-xs" onClick={handleCopy}>
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <Textarea
              readOnly
              rows={5}
              value={embedSnippet}
              className="field-sizing-fixed min-h-0 resize-none overflow-y-auto font-mono text-[10px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
