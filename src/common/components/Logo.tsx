type LogoProps = {
  className?: string;
  showAccent?: boolean;
};

export default function Logo({ className = "", showAccent = false }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center text-foreground ${className}`}
      aria-label="Doot"
    >
      <svg
        viewBox="0 0 72 28"
        className="h-[1em] w-auto"
        fill="currentColor"
        aria-hidden="true"
      >
        <text
          x="0"
          y="22"
          fontSize="22"
          fontWeight="700"
          fontFamily="inherit"
          letterSpacing="0.5"
        >
          Doot
        </text>
      </svg>
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
