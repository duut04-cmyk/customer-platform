export default function TrackingMap() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/60 shadow-sm">
      <svg
        viewBox="0 0 640 320"
        className="h-[220px] w-full sm:h-[280px] md:h-[320px]"
        role="img"
        aria-label="Abstract map showing delivery route from pickup to drop-off"
      >
        <defs>
          <pattern
            id="tracking-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(10,10,10,0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="640" height="320" fill="url(#tracking-grid)" />
        <rect x="80" y="60" width="120" height="80" rx="8" fill="rgba(10,10,10,0.03)" />
        <rect
          x="240"
          y="40"
          width="160"
          height="100"
          rx="8"
          fill="rgba(10,10,10,0.04)"
        />
        <rect
          x="440"
          y="80"
          width="140"
          height="90"
          rx="8"
          fill="rgba(10,10,10,0.03)"
        />
        <rect
          x="160"
          y="180"
          width="200"
          height="90"
          rx="8"
          fill="rgba(10,10,10,0.04)"
        />
        <rect
          x="400"
          y="190"
          width="180"
          height="80"
          rx="8"
          fill="rgba(10,10,10,0.03)"
        />

        <path
          d="M 120 140 C 220 100, 300 180, 400 120 S 520 200, 520 220"
          fill="none"
          stroke="rgba(249,115,22,0.35)"
          strokeWidth="3"
          strokeDasharray="6 6"
        />

        <circle cx="120" cy="140" r="10" fill="#f97316" />
        <circle
          cx="120"
          cy="140"
          r="16"
          fill="none"
          stroke="#f97316"
          strokeOpacity="0.25"
          strokeWidth="2"
        />

        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 90,35; 0,0"
            dur="5s"
            repeatCount="indefinite"
          />
          <circle cx="300" cy="145" r="14" fill="#f97316" opacity="0.2" />
          <rect x="292" y="137" width="16" height="12" rx="2" fill="#f97316" />
          <circle cx="308" cy="151" r="3" fill="#f97316" />
        </g>

        <circle cx="520" cy="220" r="10" fill="#0a0a0a" />
        <circle
          cx="520"
          cy="220"
          r="16"
          fill="none"
          stroke="#0a0a0a"
          strokeOpacity="0.15"
          strokeWidth="2"
        />

        <text
          x="120"
          y="175"
          textAnchor="middle"
          fontSize="11"
          fill="rgba(10,10,10,0.55)"
          fontFamily="inherit"
        >
          Pickup
        </text>
        <text
          x="520"
          y="255"
          textAnchor="middle"
          fontSize="11"
          fill="rgba(10,10,10,0.55)"
          fontFamily="inherit"
        >
          Drop-off
        </text>
      </svg>
    </div>
  );
}
