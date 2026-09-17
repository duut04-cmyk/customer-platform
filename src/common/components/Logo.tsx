type LogoProps = {
  className?: string;
  showAccent?: boolean;
  /** Show only the D mark (useful for compact mobile headers). */
  markOnly?: boolean;
  /**
   * On viewports below `md`, show only the D mark;
   * from `md` up, show mark + wordmark.
   */
  compactOnMobile?: boolean;
};

function DootMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-accent" />
      {/* Geometric D with open counter (evenodd) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        className="fill-accent-foreground"
        d="M8.75 7h8.1c5.35 0 8.9 3.2 8.9 9s-3.55 9-8.9 9h-8.1V7zm4.35 3.65v10.7h3.7c2.95 0 4.7-1.85 4.7-5.35s-1.75-5.35-4.7-5.35h-3.7z"
      />
      {/* Brand dot in the D bowl — the “oo” of Doot */}
      <circle cx="20.35" cy="16" r="2.35" className="fill-accent-foreground" />
    </svg>
  );
}

export default function Logo({
  className = "",
  showAccent = false,
  markOnly = false,
  compactOnMobile = false,
}: LogoProps) {
  const wordmarkHidden = markOnly
    ? "hidden"
    : compactOnMobile
      ? "hidden md:inline"
      : "inline";

  return (
    <span
      className={`inline-flex items-center gap-[0.4em] text-foreground ${className}`}
      aria-label="Doot"
    >
      <DootMark className="h-[1.05em] w-[1.05em] shrink-0" />
      <span
        className={`font-bold tracking-[-0.04em] leading-none ${wordmarkHidden}`}
        aria-hidden="true"
      >
        Doot
      </span>
      {showAccent && (
        <span
          className="flex h-4 w-4 items-center justify-center rounded-sm bg-accent text-[10px] font-bold leading-none text-accent-foreground"
          aria-hidden="true"
        >
          +
        </span>
      )}
    </span>
  );
}
