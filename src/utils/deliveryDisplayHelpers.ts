import type { Delivery, DeliveryStatus } from "@/deliveries/types";
import {
  IconAlert,
  IconCheck,
  IconClock,
  IconTruck,
} from "@/dashboard/components/icons";

const ACTIVE_STATUSES: DeliveryStatus[] = [
  "booked",
  "driver_assigned",
  "picked_up",
  "in_transit",
];

export function getStatusPillClasses(status: DeliveryStatus): string {
  if (status === "delivered") {
    return "bg-blue-50 text-blue-700";
  }
  if (status === "failed" || status === "cancelled") {
    return "bg-red-50 text-red-700";
  }
  if (ACTIVE_STATUSES.includes(status)) {
    return "bg-emerald-50 text-emerald-700";
  }
  return "bg-surface text-foreground";
}

export function getStatusIcon(status: DeliveryStatus) {
  if (status === "delivered") return IconCheck;
  if (status === "failed" || status === "cancelled") return IconAlert;
  if (ACTIVE_STATUSES.includes(status)) return IconTruck;
  return IconClock;
}

export function getStatusSubtext(delivery: Delivery): string {
  const eta = delivery.estimatedArrival;
  if (delivery.status === "in_transit" || delivery.status === "picked_up") {
    if (eta.startsWith("Estimated ")) return `ETA ${eta.replace("Estimated ", "")}`;
    if (eta && eta !== "—") return `ETA ${eta}`;
    return "ETA —";
  }
  if (delivery.status === "delivered") {
    return eta.startsWith("Delivered ") ? eta : `Delivered ${eta}`;
  }
  if (delivery.status === "failed" || delivery.status === "cancelled") {
    return "—";
  }
  return eta;
}

export function getListDateTime(delivery: Delivery): string {
  if (delivery.listTimeLabel) return delivery.listTimeLabel;
  return delivery.dateLabel;
}

export function getListDateParts(delivery: Delivery): { date: string; time?: string } {
  const label = getListDateTime(delivery);
  const timeMatch = label.match(/\s(\d{1,2}:\d{2}\s[AP]M)$/i);

  if (timeMatch) {
    const date = label.slice(0, label.length - timeMatch[0].length).trim();
    return {
      date: date || delivery.dateLabel,
      time: timeMatch[1],
    };
  }

  return { date: delivery.dateLabel || label };
}

export function getCategoryIconBg(packageType: string): string {
  const normalized = packageType.toLowerCase();
  if (normalized.includes("medicine")) return "bg-emerald-100/70 text-emerald-700";
  if (normalized.includes("food")) return "bg-amber-100/70 text-amber-700";
  if (normalized.includes("document")) return "bg-violet-100/70 text-violet-700";
  if (normalized.includes("parcel") || normalized.includes("box")) {
    return "bg-slate-100 text-slate-600";
  }
  return "bg-neutral-100 text-neutral-600";
}

type PartnerMark = {
  letter: string;
  className: string;
};

const PARTNER_MARKS: Record<string, PartnerMark> = {
  FlashDrop: { letter: "F", className: "bg-orange-500 text-white" },
  MoveX: { letter: "M", className: "bg-blue-600 text-white" },
  CityFleet: { letter: "C", className: "bg-violet-600 text-white" },
  SwiftGo: { letter: "S", className: "bg-emerald-600 text-white" },
};

export function getPartnerMark(service?: string): PartnerMark {
  if (service && PARTNER_MARKS[service]) {
    return PARTNER_MARKS[service];
  }
  return { letter: "?", className: "bg-surface text-muted-foreground" };
}

export const DELIVERY_PARTNERS = [
  "FlashDrop",
  "MoveX",
  "CityFleet",
  "SwiftGo",
] as const;
