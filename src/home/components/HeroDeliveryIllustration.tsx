type HeroDeliveryIllustrationProps = {
  className?: string;
  ariaLabel?: string;
};

/**
 * Layered hero visual: phone map + floating chips.
 * No courier, fleet, prices, or ETAs — only pickup → route → delivery.
 */
export default function HeroDeliveryIllustration({
  className = "",
  ariaLabel = "Map showing a local delivery from pickup to destination",
}: HeroDeliveryIllustrationProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`relative mx-auto w-full max-w-[420px] lg:max-w-[480px] ${className}`}
    >
      {/* Peach atmosphere */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,#FFE8D4_0%,#FFF0E3_35%,transparent_68%)]"
        aria-hidden="true"
      />

      {/* Soft decorative bars (no metrics) */}
      <div
        className="pointer-events-none absolute top-[18%] left-[2%] flex h-[42%] items-end gap-1.5 opacity-40"
        aria-hidden="true"
      >
        {[28, 44, 36, 52, 40].map((h, i) => (
          <span
            key={i}
            className="w-2.5 rounded-full bg-[#D9D3CB] sm:w-3"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute top-[22%] right-[0%] flex h-[38%] items-end gap-1.5 opacity-35"
        aria-hidden="true"
      >
        {[40, 56, 32, 48].map((h, i) => (
          <span
            key={i}
            className="w-2.5 rounded-full bg-[#D9D3CB] sm:w-3"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Phone shell */}
      <div className="relative z-10 mx-auto w-[72%] max-w-[260px] pt-6 sm:max-w-[280px] lg:max-w-[300px]">
        <div className="rounded-[2.15rem] bg-[#1A1A1A] p-[9px] shadow-[0_28px_60px_-12px_rgba(23,23,23,0.35),0_12px_24px_-8px_rgba(23,23,23,0.18)]">
          <div className="relative overflow-hidden rounded-[1.7rem] bg-[#FFFCF8]">
            {/* Notch */}
            <div className="absolute top-2.5 left-1/2 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-[#1A1A1A]/20" />

            {/* Map */}
            <div className="relative m-3 mt-8 aspect-[9/14] overflow-hidden rounded-2xl bg-[#FFF5EB]">
              <svg
                viewBox="0 0 200 300"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {/* Roads */}
                <g stroke="#E5DFD7" strokeWidth="2.5" fill="none">
                  <path d="M0 70 H200" />
                  <path d="M0 130 H200" />
                  <path d="M0 190 H200" />
                  <path d="M0 250 H200" />
                  <path d="M55 0 V300" />
                  <path d="M110 0 V300" />
                  <path d="M155 0 V300" />
                </g>
                {/* Blocks */}
                <g fill="#FFDFC4" opacity="0.9">
                  <rect x="18" y="28" width="28" height="32" rx="4" />
                  <rect x="68" y="85" width="32" height="28" rx="4" />
                  <rect x="125" y="40" width="26" height="36" rx="4" />
                  <rect x="20" y="150" width="24" height="30" rx="4" />
                  <rect x="120" y="160" width="34" height="26" rx="4" />
                  <rect x="70" y="210" width="28" height="24" rx="4" />
                </g>
                {/* Soft route glow */}
                <path
                  d="M58 230 C 78 180, 95 140, 118 100 S 150 55, 142 42"
                  fill="none"
                  stroke="#FF6B0A"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.18"
                />
                {/* Route */}
                <path
                  d="M58 230 C 78 180, 95 140, 118 100 S 150 55, 142 42"
                  fill="none"
                  stroke="#FF6B0A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Pickup pin */}
                <g transform="translate(46, 214)">
                  <path
                    d="M12 0 C5.4 0 0 5.2 0 11.6 0 20 12 32 12 32s12-12 12-20.4C24 5.2 18.6 0 12 0z"
                    fill="#FF6B0A"
                  />
                  <circle cx="12" cy="11.5" r="4.2" fill="#FFF" />
                </g>
                {/* Delivery pin */}
                <g transform="translate(130, 22)">
                  <path
                    d="M12 0 C5.4 0 0 5.2 0 11.6 0 20 12 32 12 32s12-12 12-20.4C24 5.2 18.6 0 12 0z"
                    fill="#FF6B0A"
                  />
                  <circle cx="12" cy="11.5" r="4.2" fill="#FFF" />
                </g>
              </svg>
            </div>

            {/* Status pill */}
            <div className="mx-3 mb-4 flex justify-center">
              <span className="inline-flex items-center rounded-full bg-[#FFF0E3] px-3.5 py-1.5 text-[10px] font-semibold tracking-wide text-[#626B78] sm:text-[11px]">
                Best available option
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Pickup chip */}
      <div
        className="hero-float absolute bottom-[22%] left-0 z-20 flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2.5 shadow-[0_10px_28px_-8px_rgba(23,23,23,0.18)] sm:left-[-2%] sm:px-3.5"
        aria-hidden="true"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="text-small font-bold text-foreground">Pickup</span>
      </div>

      {/* Floating Delivery chip */}
      <div
        className="hero-float-delayed absolute top-[12%] right-0 z-20 flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2.5 shadow-[0_10px_28px_-8px_rgba(23,23,23,0.18)] sm:right-[-2%] sm:px-3.5"
        aria-hidden="true"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="text-small font-bold text-foreground">Delivery</span>
      </div>

      {/* Brand parcel card */}
      <div
        className="hero-float absolute right-[2%] bottom-[6%] z-20 rounded-2xl border border-border bg-white p-2.5 shadow-[0_12px_32px_-10px_rgba(23,23,23,0.2)] sm:right-[4%] sm:bottom-[4%] sm:p-3"
        aria-hidden="true"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-accent sm:h-16 sm:w-16">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-extrabold text-white sm:h-9 sm:w-9 sm:text-base">
            D
          </div>
        </div>
      </div>
    </div>
  );
}
