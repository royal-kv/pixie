import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { GameEventType, Session } from '@/types';
import { runSuggestionAgent, runBuildAgent, runRemixAgent } from '@/lib/agents';
import { composeEffectiveBrief } from '@/lib/brief';
import { appendChatMessage, logGameEvent } from '@/lib/sessionHelpers';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatComposer from '@/components/chat/ChatComposer';
import TypingBubble from '@/components/chat/TypingBubble';

interface Props {
  session: Session;
  updateSession: (updater: (prev: Session) => Session) => void;
  onStartNew: () => void;
}

type IntakeStep = 'brand' | 'goal_audience' | 'ready';

/** Mock fixtures include dev-facing notes about themselves (e.g. "this is a hardcoded fixture") —
 * strip those before showing "assumptions" to the user in chat. */
function filterAssumptions(assumptions: string[]): string[] {
  return assumptions.filter((a) => !/mock|fixture/i.test(a));
}

const URL_PATTERN = /\bhttps?:\/\/\S+|\b(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/\S*)?\b/i;

const EDGE_PUNCTUATION = /[-–—,:;()[\]{}"'.]+$/;

/** Splits a combined "brand name + optional site url" answer into its two parts. */
function parseBrandAndSite(text: string): { brandName: string; siteUrl?: string } {
  const match = text.match(URL_PATTERN);
  if (!match) return { brandName: text.trim() };
  const siteUrl = match[0].replace(EDGE_PUNCTUATION, '');
  const brandName = (text.slice(0, match.index) + text.slice((match.index ?? 0) + match[0].length))
    .trim()
    .replace(EDGE_PUNCTUATION, '')
    .replace(/^[-–—,:;()[\]{}"']+/, '')
    .trim();
  return { brandName: brandName || siteUrl, siteUrl };
}

const TYPING_DELAY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const QUESTIONS: Record<Exclude<IntakeStep, 'ready'>, string> = {
  brand:
    "Hey, I'm Pixie 👋 Let's build a mini-game for your next campaign. What's the brand name — and if you've got a site URL, drop that too (optional)?",
  goal_audience:
    "Great. What's the goal for this game, and who's the target audience or generation? e.g. \"drive sign-ups for our new product launch, targeting Gen Z.\"",
};

export default function CreateGamePage({ session, updateSession, onStartNew }: Props) {
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState('');
  const generationStarted = useRef(false);
  const greeted = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const brief = session.brandBrief;

  function currentStep(): IntakeStep {
    if (session.stage !== 'intake') return 'ready';
    if (!brief.brand_name?.trim()) return 'brand';
    if (!brief.marketing_goal?.trim()) return 'goal_audience';
    return 'ready';
  }

  useEffect(() => {
    if (greeted.current || session.chatMessages.length > 0) return;
    greeted.current = true;
    setBusy(true);
    const timer = setTimeout(() => {
      updateSession((prev) => appendChatMessage(prev, 'assistant', QUESTIONS.brand));
      setBusy(false);
    }, TYPING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [session.chatMessages.length, updateSession]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [session.chatMessages.length, busy]);

  useEffect(() => {
    if (session.stage !== 'intake' || generationStarted.current) return;
    if (currentStep() !== 'ready') return;
    generationStarted.current = true;
    void generateConcepts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.stage, brief.brand_name, brief.marketing_goal]);

  async function generateConcepts() {
    setBusy(true);
    setBusyLabel('');
    await delay(TYPING_DELAY_MS);
    updateSession((prev) =>
      appendChatMessage(
        prev,
        'assistant',
        `Got it — building 3 game concepts for ${prev.brandBrief.brand_name}.`,
      ),
    );
    setBusyLabel(`Sketching 3 game concepts for ${brief.brand_name}…`);
    try {
      const effectiveBrief = composeEffectiveBrief(session);
      const result = await runSuggestionAgent(effectiveBrief);
      updateSession((prev) => ({ ...prev, concepts: result.suggestions, stage: 'concepts_ready' }));
      setBusyLabel('Building all 3 as playable games…');
      await Promise.allSettled(
        result.suggestions.map(async (concept) => {
          try {
            const html = await runBuildAgent({ concept, brief: effectiveBrief });
            updateSession((prev) => ({
              ...prev,
              games: [
                ...prev.games.filter((g) => g.conceptId !== concept.id),
                { conceptId: concept.id, html, createdAt: Date.now() },
              ],
            }));
          } catch (err) {
            console.error(err);
            updateSession((prev) =>
              appendChatMessage(
                prev,
                'assistant',
                `Hmm, "${concept.title}" failed to build: ${
                  err instanceof Error ? err.message : 'unknown error'
                }.`,
              ),
            );
          }
        }),
      );
      updateSession((prev) => {
        const assumptions = filterAssumptions(result.assumptions);
        const assumptionsText = assumptions.length
          ? `Assumptions I made: ${assumptions.join('; ')}\n\n`
          : '';
        return appendChatMessage(
          { ...prev, stage: 'games_ready' },
          'assistant',
          `${assumptionsText}Here are 3 concepts — tap Play to try them, then tell me what you'd like to combine or change.`,
          { kind: 'concepts', conceptIds: result.suggestions.map((c) => c.id) },
        );
      });
    } catch (err) {
      console.error(err);
      updateSession((prev) =>
        appendChatMessage(
          prev,
          'assistant',
          `Something went wrong generating concepts: ${
            err instanceof Error ? err.message : 'unknown error'
          }. Describe your campaign again to retry?`,
        ),
      );
      generationStarted.current = false;
    } finally {
      setBusy(false);
      setBusyLabel('');
    }
  }

  async function handleRemix(feedback: string) {
    setBusy(true);
    setBusyLabel('Remixing based on your feedback…');
    try {
      const result = await runRemixAgent({ priorConcepts: session.concepts, feedback });
      const { assumptions: rawAssumptions, ...concept } = result;
      const assumptions = filterAssumptions(rawAssumptions);
      const effectiveBrief = composeEffectiveBrief(session);
      const html = await runBuildAgent({ concept, brief: effectiveBrief });
      updateSession((prev) => {
        const next: Session = {
          ...prev,
          stage: 'iterating',
          concepts: [...prev.concepts, concept],
          games: [...prev.games, { conceptId: concept.id, html, createdAt: Date.now() }],
          currentGameId: concept.id,
        };
        const assumptionsText = assumptions.length ? `\n\nAssumptions: ${assumptions.join('; ')}` : '';
        return appendChatMessage(
          next,
          'assistant',
          `Here's the remix: "${concept.title}".${assumptionsText}`,
          { kind: 'concepts', conceptIds: [concept.id] },
        );
      });
    } catch (err) {
      console.error(err);
      updateSession((prev) =>
        appendChatMessage(
          prev,
          'assistant',
          `Couldn't remix that: ${err instanceof Error ? err.message : 'unknown error'}. Try rephrasing?`,
        ),
      );
    } finally {
      setBusy(false);
      setBusyLabel('');
    }
  }

  function handleFinalize(conceptId: string) {
    updateSession((prev) =>
      appendChatMessage(
        { ...prev, stage: 'finalized', finalGameId: conceptId, currentGameId: conceptId },
        'assistant',
        "Locked in! Here's your final game, ready to embed or download.",
        { kind: 'final', conceptIds: [conceptId] },
      ),
    );
  }

  function handleGameEvent(conceptId: string) {
    return (type: GameEventType, payload?: unknown) => {
      updateSession((prev) => logGameEvent(prev, conceptId, type, payload));
    };
  }

  function handleSend(text: string) {
    updateSession((prev) => appendChatMessage(prev, 'user', text));
    const step = currentStep();

    if (step === 'brand') {
      const { brandName, siteUrl } = parseBrandAndSite(text);
      updateSession((prev) => ({
        ...prev,
        brandBrief: {
          ...prev.brandBrief,
          brand_name: brandName,
          sources: siteUrl ? [siteUrl] : prev.brandBrief.sources,
        },
      }));
      void queueAssistant(QUESTIONS.goal_audience);
    } else if (step === 'goal_audience') {
      updateSession((prev) => ({
        ...prev,
        brandBrief: { ...prev.brandBrief, marketing_goal: text.trim(), target_audience: text.trim() },
      }));
    } else if (session.stage === 'games_ready' || session.stage === 'iterating') {
      void handleRemix(text);
    }
  }

  async function queueAssistant(content: string) {
    setBusy(true);
    await delay(TYPING_DELAY_MS);
    updateSession((prev) => appendChatMessage(prev, 'assistant', content));
    setBusy(false);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
          {session.chatMessages.map((m, i) => (
            <ChatBubble
              key={i}
              message={m}
              session={session}
              onFinalize={handleFinalize}
              onGameEvent={handleGameEvent}
            />
          ))}
          {busy && <TypingBubble label={busyLabel} />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      {session.stage === 'finalized' ? (
        <div className="flex items-center justify-center gap-3 border-t p-4">
          <p className="text-sm text-muted-foreground">Campaign finalized.</p>
          <Button onClick={onStartNew} className="gap-1.5">
            <Sparkles className="size-4" /> Start a new game
          </Button>
        </div>
      ) : (
        <ChatComposer disabled={busy} onSend={handleSend} />
      )}
    </div>
  );
}
