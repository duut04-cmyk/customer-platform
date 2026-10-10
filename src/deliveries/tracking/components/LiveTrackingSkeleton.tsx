function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface ${className}`} />;
}

export default function LiveTrackingSkeleton() {
  return (
    <div
      className="space-y-6 lg:space-y-8"
      aria-busy="true"
      aria-label="Loading live tracking"
    >
      <div className="space-y-2">
        <Pulse className="h-4 w-28" />
        <Pulse className="h-8 w-52" />
        <Pulse className="h-4 w-72 max-w-full" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex flex-col gap-4">
          <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
            <Pulse className="mb-4 h-6 w-32" />
            <div className="mb-4 flex gap-3 border-b border-border pb-4">
              <Pulse className="h-12 w-12 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2 pt-1">
                <Pulse className="h-5 w-48" />
                <Pulse className="h-4 w-full max-w-md" />
              </div>
            </div>
            <Pulse className="h-[min(55vh,480px)] w-full rounded-lg sm:h-[360px] md:h-[420px] lg:h-[480px]" />
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
            <Pulse className="mb-5 h-6 w-36" />
            <div className="space-y-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <Pulse className="h-8 w-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2 pt-0.5">
                    <Pulse className="h-4 w-40" />
                    <Pulse className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <Pulse className="mb-4 h-6 w-44" />
            <Pulse className="h-24 w-full rounded-lg" />
          </section>

          <div className="flex gap-3">
            <Pulse className="h-10 w-40 rounded-[6px]" />
            <Pulse className="h-10 w-36 rounded-[6px]" />
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <div className="flex gap-3">
              <Pulse className="h-10 w-10 shrink-0 rounded-full" />
              <Pulse className="h-5 w-32" />
            </div>
            <div className="mt-4 flex gap-3">
              <Pulse className="h-14 w-14 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Pulse className="h-5 w-36" />
                <Pulse className="h-4 w-28" />
                <Pulse className="h-4 w-16" />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Pulse className="h-4 w-24" />
              <Pulse className="h-4 w-20" />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <Pulse className="mb-3 h-5 w-36" />
            <Pulse className="mb-2 h-4 w-full" />
            <Pulse className="h-4 w-40 max-w-full" />
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <Pulse className="mb-3 h-5 w-44" />
            <Pulse className="h-16 w-full" />
          </section>
        </aside>
      </div>
    </div>
  );
}
