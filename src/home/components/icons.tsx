type IconProps = {
  className?: string;
};

export function ArrowRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2.5 1.5v9l7-4.5-7-4.5z" />
    </svg>
  );
}

export function LocationPinIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export function SearchIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AwardIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M8.5 14 7 21l5-2.5L17 21l-1.5-7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PackageIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 8.5 12 3l9 5.5v7L12 21 3 15.5v-7z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M12 12v9M3 8.5 12 12l9-3.5" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export function PriceTagIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M8 20 20 8h8l4 4-12 12-8-4V20z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <text x="15" y="23" fontSize="11" fontWeight="700" fill="currentColor">
        ₹
      </text>
    </svg>
  );
}

export function ClockCheckIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="18" cy="20" r="11" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M18 14v6l4 2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 20h2M26 20h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle
        cx="30"
        cy="30"
        r="6"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M28 30l1.5 1.5 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldCheckIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 5 9 9.5v9c0 7 4.8 13.5 11 15.5 6.2-2 11-8.5 11-15.5v-9L20 5z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M15 20l4 4 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckCircleIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="currentColor" />
      <path
        d="M6.5 10l2 2 5-5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function XCircleIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="#d4d4d4" />
      <path
        d="M7.5 7.5l5 5M12.5 7.5l-5 5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StarIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 1.5l1.8 3.7 4.1.6-3 2.9.7 4.1L8 10.8l-3.6 1.9.7-4.1-3-2.9 4.1-.6L8 1.5z" />
    </svg>
  );
}

export function SocialFacebookIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.5 8.5H11l-.5 2H9.5V14H7V10.5H5.5V8.5H7V7.5c0-1.2.7-2.5 2.5-2.5H11v2H9.8c-.3 0-.8.1-.8.8V8.5z" />
    </svg>
  );
}

export function SocialTwitterIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.5 4.5h1.2l-2.7 3 3.2 4.2H10l-2-2.6-2.3 2.6H4.1l2.9-3.3L3.5 4.5h2.9l1.8 2.4 2.1-2.4h.2z" />
    </svg>
  );
}

export function SocialLinkedInIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.5 6.5v5H2.5v-5h2zM3.5 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM13.5 11.5v-3c0-1.6-.9-2.3-2.1-2.3-.9 0-1.4.5-1.7 1v-1h-2v5h2V9.2c0-.6.5-1 1.1-1 .6 0 .9.4.9 1v2.3h2z" />
    </svg>
  );
}

export function SocialInstagramIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="10"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11.2" cy="4.8" r="0.6" fill="currentColor" />
    </svg>
  );
}
