import { useEffect, useRef } from 'react';
import type { GameEventType } from '../types';

interface Props {
  html: string;
  gameId: string;
  onEvent: (type: GameEventType, payload?: unknown) => void;
  className?: string;
}

/** Renders a built game in a sandboxed iframe, logging a `view` event on load and a
 * `conversion` event whenever the game posts `{ type: 'game-conversion', ... }`. */
export default function GameFrame({ html, gameId, onEvent, className }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const viewedRef = useRef(false);

  useEffect(() => {
    viewedRef.current = false;
  }, [gameId, html]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;
      if (event.data?.type === 'game-conversion') {
        onEvent('conversion', event.data);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEvent]);

  function handleLoad() {
    if (!viewedRef.current) {
      viewedRef.current = true;
      onEvent('view');
    }
  }

  return (
    <iframe
      ref={iframeRef}
      title={gameId}
      sandbox="allow-scripts"
      srcDoc={html}
      onLoad={handleLoad}
      className={className ?? 'w-full h-full bg-black rounded'}
    />
  );
}
