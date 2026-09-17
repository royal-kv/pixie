import LoadingDots from './LoadingDots';

export default function TypingBubble({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground w-fit">
      <LoadingDots />
      {label}
    </div>
  );
}
