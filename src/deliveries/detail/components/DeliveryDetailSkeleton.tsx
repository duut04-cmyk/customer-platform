function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface ${className}`} />;
}

export default function DeliveryDetailSkeleton() {
  return (
    <div
      className="space-y-6 lg:space-y-8"
      aria-busy="true"
      aria-label="Loading delivery details"
    >
      {/* Header */}
      <div className="space-y-2">
        <Pulse className="h-4 w-28" />
        <Pulse className="h-8 w-56" />
        <Pulse className="h-4 w-80 max-w-full" />
      </div>

      {/* Hero summary card */}
      <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="space-y-3">
            <Pulse className="h-6 w-24 rounded-full" />
            <Pulse className="h-8 w-40" />
            <Pulse className="h-4 w-36" />
          </div>
          <Pulse className="h-16 w-full rounded-lg sm:w-52" />
        </div>
        <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <Pulse className="h-14 w-full" />
          <Pulse className="h-14 w-full" />
          <Pulse className="h-14 w-full" />
        </div>
        <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
          <Pulse className="h-12 flex-1" />
          <Pulse className="h-12 flex-1" />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-5">
        <div className="flex flex-col gap-4">
          {/* Timeline */}
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
            <Pulse className="mb-5 h-6 w-28" />
            <div className="space-y-5">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <Pulse className="h-8 w-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2 pt-1">
                    <Pulse className="h-4 w-36" />
                    <Pulse className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Locations */}
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
            <Pulse className="mb-4 h-6 w-48" />
            <Pulse className="h-40 w-full rounded-lg" />
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <Pulse className="mb-3 h-5 w-36" />
            <Pulse className="mb-2 h-4 w-full" />
            <Pulse className="h-4 w-48 max-w-full" />
          </section>
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <Pulse className="mb-3 h-5 w-28" />
            <Pulse className="mb-2 h-4 w-full" />
            <Pulse className="h-4 w-40 max-w-full" />
          </section>
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <Pulse className="mb-3 h-5 w-32" />
            <Pulse className="h-4 w-full" />
          </section>
        </aside>
      </div>
    </div>
  );
}
