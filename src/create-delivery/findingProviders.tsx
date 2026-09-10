import type { ComponentType } from "react";
import {
  IconPartnerCityFleet,
  IconPartnerFlashDrop,
  IconPartnerMoveX,
  IconPartnerSwiftGo,
} from "@/dashboard/components/icons";

export type FindingProvider = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
};

function IconPartnerDoot({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 4h8.5c3.3 0 5.5 2.1 5.5 5.2 0 2.5-1.3 4.3-3.5 5l3.8 5.8H15l-3.2-5H10v5H6V4zm4 3.5v3.5h4c1.2 0 1.9-.7 1.9-1.8S15.2 7.5 14 7.5h-4z" />
    </svg>
  );
}

export const FINDING_PROVIDERS: FindingProvider[] = [
  {
    id: "flashdrop",
    name: "FlashDrop",
    icon: IconPartnerFlashDrop,
    iconClassName: "text-blue-600",
  },
  {
    id: "movex",
    name: "MoveX",
    icon: IconPartnerMoveX,
    iconClassName: "text-emerald-600",
  },
  {
    id: "cityfleet",
    name: "CityFleet",
    icon: IconPartnerCityFleet,
    iconClassName: "text-blue-700",
  },
  {
    id: "swiftgo",
    name: "SwiftGo",
    icon: IconPartnerSwiftGo,
    iconClassName: "text-orange-500",
  },
  {
    id: "doot",
    name: "Doot Logistics",
    icon: IconPartnerDoot,
    iconClassName: "text-accent",
  },
];
