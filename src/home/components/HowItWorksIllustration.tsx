type HowItWorksIllustrationProps = {
  className?: string;
};

/**
 * Journey visual for How it works — platform orchestration, not a Doot fleet.
 */
export default function HowItWorksIllustration({
  className = "",
}: HowItWorksIllustrationProps) {
  return (
    <div
      role="img"
      aria-label="Delivery journey from pickup through Doot to drop-off"
      className={`relative overflow-hidden rounded-[1.5rem] border border-border bg-[#FFFBF5] shadow-[0_20px_50px_-24px_rgba(23,23,23,0.2)] md:rounded-[1.75rem] ${className}`}
    >
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute -left-10 top-1/2 h-[90%] w-[70%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,#FFE8D4_0%,transparent_70%)] opacity-90"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-8 bottom-0 h-[60%] w-[55%] rounded-full bg-[radial-gradient(circle_at_center,#FFF0E3_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 480 420"
        className="relative z-10 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Soft city blocks */}
        <g fill="#E8E2DA" opacity="0.45">
          <rect x="36" y="250" width="36" height="90" rx="4" />
          <rect x="80" y="220" width="28" height="120" rx="4" />
          <rect x="116" y="240" width="40" height="100" rx="4" />
          <rect x="340" y="230" width="32" height="110" rx="4" />
          <rect x="380" y="200" width="44" height="140" rx="4" />
          <rect x="300" y="255" width="30" height="85" rx="4" />
        </g>

        {/* Ground path glow */}
        <path
          d="M90 300 C 160 240, 220 320, 280 250 S 380 180, 390 160"
          fill="none"
          stroke="#FF6B0A"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.12"
        />
        {/* Main route */}
        <path
          d="M90 300 C 160 240, 220 320, 280 250 S 380 180, 390 160"
          fill="none"
          stroke="#FF6B0A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="0"
        />

        {/* Pickup node */}
        <g transform="translate(62, 268)">
          <circle cx="28" cy="28" r="28" fill="#FFF" stroke="#EAE7E3" strokeWidth="2" />
          <circle cx="28" cy="28" r="22" fill="#FFF5EB" />
          <path
            d="M28 14c-6.6 0-12 5-12 11.2 0 8.2 12 20.8 12 20.8s12-12.6 12-20.8C40 19 34.6 14 28 14z"
            fill="#FF6B0A"
          />
          <circle cx="28" cy="25" r="4" fill="#FFF" />
        </g>
        <g transform="translate(48, 340)">
          <rect
            width="76"
            height="28"
            rx="10"
            fill="#FFF"
            stroke="#EAE7E3"
            strokeWidth="1.5"
          />
          <text
            x="38"
            y="18"
            textAnchor="middle"
            fill="#191919"
            fontSize="12"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Pickup
          </text>
        </g>

        {/* Center Doot platform node */}
        <g transform="translate(210, 210)">
          <circle cx="30" cy="30" r="34" fill="#FFF" stroke="#EAE7E3" strokeWidth="2" />
          <circle cx="30" cy="30" r="26" fill="#FF6B0A" />
          <text
            x="30"
            y="36"
            textAnchor="middle"
            fill="#FFF"
            fontSize="18"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
          >
            D
          </text>
        </g>
        <g transform="translate(198, 168)">
          <rect width="84" height="26" rx="10" fill="#171717" />
          <text
            x="42"
            y="17"
            textAnchor="middle"
            fill="#FFF"
            fontSize="11"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Best option
          </text>
        </g>

        {/* Drop-off node */}
        <g transform="translate(362, 118)">
          <circle cx="28" cy="28" r="28" fill="#FFF" stroke="#EAE7E3" strokeWidth="2" />
          <circle cx="28" cy="28" r="22" fill="#FFF5EB" />
          <path
            d="M28 14c-6.6 0-12 5-12 11.2 0 8.2 12 20.8 12 20.8s12-12.6 12-20.8C40 19 34.6 14 28 14z"
            fill="#FF6B0A"
          />
          <circle cx="28" cy="25" r="4" fill="#FFF" />
        </g>
        <g transform="translate(348, 86)">
          <rect
            width="84"
            height="28"
            rx="10"
            fill="#FFF"
            stroke="#EAE7E3"
            strokeWidth="1.5"
          />
          <text
            x="42"
            y="18"
            textAnchor="middle"
            fill="#191919"
            fontSize="12"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Drop-off
          </text>
        </g>

        {/* Mini step chips along the path */}
        <g transform="translate(130, 250)">
          <rect width="52" height="22" rx="11" fill="#FFF" stroke="#EAE7E3" />
          <circle cx="12" cy="11" r="5" fill="#FF6B0A" />
          <text
            x="32"
            y="15"
            textAnchor="middle"
            fill="#626B78"
            fontSize="9"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            1
          </text>
        </g>
        <g transform="translate(250, 268)">
          <rect width="52" height="22" rx="11" fill="#FFF" stroke="#EAE7E3" />
          <circle cx="12" cy="11" r="5" fill="#FF6B0A" />
          <text
            x="32"
            y="15"
            textAnchor="middle"
            fill="#626B78"
            fontSize="9"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            2
          </text>
        </g>
        <g transform="translate(310, 198)">
          <rect width="52" height="22" rx="11" fill="#FFF" stroke="#EAE7E3" />
          <circle cx="12" cy="11" r="5" fill="#FF6B0A" />
          <text
            x="32"
            y="15"
            textAnchor="middle"
            fill="#626B78"
            fontSize="9"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            3
          </text>
        </g>
      </svg>
    </div>
  );
}
