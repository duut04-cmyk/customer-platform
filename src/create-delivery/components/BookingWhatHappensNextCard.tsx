const steps = [
  "We'll confirm the booking with the partner.",
  "Once confirmed, you'll be able to track your delivery in real-time.",
] as const;

export default function BookingWhatHappensNextCard() {
  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50/80 p-5">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v5M12 8h.01" strokeLinecap="round" />
        </svg>
        <div className="min-w-0 flex-1">
          <h3 className="text-body font-bold text-foreground">What happens next?</h3>
          <ol className="mt-3 space-y-2.5">
            {steps.map((step, index) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-caption font-bold text-blue-700">
                  {index + 1}
                </span>
                <span className="text-small leading-relaxed text-muted-foreground">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
