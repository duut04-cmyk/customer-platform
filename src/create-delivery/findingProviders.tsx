import type { ComponentType } from "react";
import { IconClock, IconTruck } from "@/dashboard/components/icons";

export type FindingProvider = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
};

function IconRouteCheck({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
    </svg>
  );
}

/** Neutral orchestration steps — no fabricated provider brand names. */
export const FINDING_PROVIDERS: FindingProvider[] = [
  {
    id: "route",
    name: "Checking route",
    icon: IconRouteCheck,
    iconClassName: "text-blue-600",
  },
  {
    id: "availability",
    name: "Checking availability",
    icon: IconClock,
    iconClassName: "text-emerald-600",
  },
  {
    id: "quote",
    name: "Getting quote",
    icon: IconTruck,
    iconClassName: "text-blue-700",
  },
];
