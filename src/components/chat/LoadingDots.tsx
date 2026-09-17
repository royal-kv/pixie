import { cn } from '@/lib/utils';

export default function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-1', className)}>
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current" />
    </span>
  );
}
