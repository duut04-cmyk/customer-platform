type BookingStatusBannersProps = {
  serviceName: string;
  showAlmostThere: boolean;
};

function StatusSpinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
      aria-hidden="true"
    />
  );
}

export default function BookingStatusBanners({
  serviceName,
  showAlmostThere,
}: BookingStatusBannersProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2.5 rounded-lg border border-accent/20 bg-[#fff7ed] px-3 py-2.5">
        <svg
          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v5M12 8h.01" strokeLinecap="round" />
        </svg>
        <p className="text-caption leading-relaxed text-muted-foreground">
          Doot is currently booking with {serviceName} and checking availability for
          your selected time slot.
        </p>
      </div>

      {showAlmostThere && (
        <div className="flex gap-2.5 rounded-lg bg-blue-50 px-3 py-2.5">
          <StatusSpinner />
          <div>
            <p className="text-small font-semibold text-foreground">Almost there…</p>
            <p className="mt-0.5 text-caption leading-relaxed text-muted-foreground">
              We&apos;re coordinating with {serviceName} to confirm your delivery.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
