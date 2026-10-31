function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface ${className}`} />;
}

export default function DashboardStatsSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-2.5 md:portrait:grid-cols-4 md:portrait:gap-2 lg:landscape:grid-cols-4 lg:landscape:gap-2 xl:grid-cols-4 xl:gap-4"
      aria-busy="true"
      aria-label="Loading delivery stats"
    >
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="rounded-[10px] border border-border bg-white p-3 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)] md:portrait:p-3 lg:landscape:p-3 xl:p-4"
        >
          <div className="flex items-start gap-3">
            <Pulse className="h-9 w-9 rounded-[8px] md:portrait:h-8 md:portrait:w-8 lg:landscape:h-8 lg:landscape:w-8 xl:h-10 xl:w-10" />
            <div className="min-w-0 flex-1 space-y-2">
              <Pulse className="h-3 w-20" />
              <Pulse className="h-7 w-12 xl:h-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
