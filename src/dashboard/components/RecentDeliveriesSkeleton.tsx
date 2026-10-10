function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface ${className}`} />;
}

export default function RecentDeliveriesSkeleton() {
  return (
    <section
      className="min-w-0 rounded-xl border border-border bg-background shadow-sm"
      aria-busy="true"
      aria-label="Loading recent deliveries"
    >
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="space-y-2">
          <Pulse className="h-6 w-40" />
          <Pulse className="h-4 w-56 max-w-full" />
        </div>
        <Pulse className="h-10 w-full rounded-[10px] sm:h-9 sm:w-44" />
      </div>

      <div className="flex items-center gap-2 px-4 py-3 sm:px-5">
        <Pulse className="h-10 min-w-0 flex-1" />
        <Pulse className="h-10 w-10 shrink-0 sm:w-[11.5rem]" />
      </div>

      <div className="flex gap-2 overflow-hidden px-4 pb-3 sm:px-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Pulse key={i} className="h-9 w-24 shrink-0 rounded-[5px]" />
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
            <Pulse className="hidden h-7 w-7 rounded-full sm:block" />
            <Pulse className="hidden h-4 w-24 sm:block" />
            <Pulse className="h-6 w-20 rounded-full" />
            <Pulse className="hidden h-4 w-20 md:block" />
          </li>
        ))}
      </ul>
    </section>
  );
}
