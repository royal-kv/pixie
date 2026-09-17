import type { ChatMessage, Concept, Game, GameEventType, Session } from '@/types';
import { cn } from '@/lib/utils';
import GameCard from './GameCard';
import FinalCard from './FinalCard';

interface Props {
  message: ChatMessage;
  session: Session;
  onFinalize: (conceptId: string) => void;
  onGameEvent: (conceptId: string) => (type: GameEventType, payload?: unknown) => void;
}

export default function ChatBubble({ message, session, onFinalize, onGameEvent }: Props) {
  const isUser = message.role === 'user';
  const concepts: Concept[] = (message.conceptIds ?? [])
    .map((id) => session.concepts.find((c) => c.id === id))
    .filter((c): c is Concept => Boolean(c));

  return (
    <div className={cn('flex w-full flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
      {message.content && (
        <div
          className={cn(
            'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
          )}
        >
          {message.content}
        </div>
      )}
      {message.kind === 'final' && concepts[0] && (
        <FinalCard
          concept={concepts[0]}
          game={session.games.find((g) => g.conceptId === concepts[0].id)}
          onEvent={onGameEvent(concepts[0].id)}
        />
      )}
      {message.kind !== 'final' && concepts.length > 0 && (
        <div className="grid w-full max-w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => {
            const game: Game | undefined = session.games.find((g) => g.conceptId === concept.id);
            return (
              <GameCard
                key={concept.id}
                concept={concept}
                game={game}
                isFinal={session.finalGameId === concept.id}
                onFinalize={() => onFinalize(concept.id)}
                onEvent={onGameEvent(concept.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
