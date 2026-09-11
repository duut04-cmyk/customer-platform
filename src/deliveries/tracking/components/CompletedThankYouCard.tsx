export default function CompletedThankYouCard() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-50"
          aria-hidden="true"
        >
          <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none">
            <path
              d="M12 24l20-10 20 10v28l-20 10-20-10V24Z"
              fill="#d1fae5"
              stroke="#10b981"
              strokeWidth="2"
            />
            <path d="M32 14v48M12 24l20 10 20-10" stroke="#10b981" strokeWidth="2" />
            <circle cx="44" cy="20" r="10" fill="#10b981" />
            <path
              d="M40 20l3 3 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-5 text-body-lg font-bold text-foreground">Thank you!</h3>
        <p className="mt-2 max-w-xs text-small leading-relaxed text-muted-foreground">
          Your trust means a lot to us.
        </p>
        <span className="mt-6 text-2xl" aria-hidden="true">
          🌿
        </span>
      </div>
    </section>
  );
}
