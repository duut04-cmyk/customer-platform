function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface ${className}`} />;
}

export default function DeliveriesListSkeleton() {
  return (
    <section
      className="min-w-0 rounded-xl border border-border bg-background"
      aria-busy="true"
      aria-label="Loading deliveries"
    >
      <div className="flex items-center gap-2 px-4 py-3 sm:px-5">
        <Pulse className="h-10 min-w-0 flex-1" />
        <Pulse className="h-10 w-10 shrink-0 sm:w-[11.5rem]" />
      </div>

      <div className="flex gap-2 overflow-hidden px-4 pb-3 sm:px-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Pulse key={i} className="h-8 w-24 shrink-0 rounded-[5px]" />
        ))}
      </div>

      <ul className="divide-y divide-border border-t border-border">
        {Array.from({ length: 5 }, (_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-4 sm:px-5">
            <Pulse className="h-10 w-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Pulse className="h-4 w-28" />
              <Pulse className="h-3 w-48 max-w-full" />
            </div>
            <Pulse className="hidden h-4 w-16 sm:block" />
            <Pulse className="h-6 w-20 rounded-full" />
            <Pulse className="hidden h-4 w-24 md:block" />
          </li>
        ))}
      </ul>
    </section>
  );
}
