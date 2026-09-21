import Link from "next/link";
import type { Delivery } from "@/deliveries/types";
import { formatInr } from "@/deliveries/pricing";
import { deliveryRoutePath } from "@/deliveries/mockDeliveries";
import {
  getCategoryIconBg,
  getListDateParts,
  getPartnerMark,
  getStatusPillClasses,
  getStatusSubtext,
} from "@/utils/deliveryDisplayHelpers";
import {
  IconAlert,
  IconBox,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconDocument,
  IconFood,
  IconMedicine,
  IconPackage,
  IconTruck,
} from "./icons";

type DeliveryCardProps = {
  delivery: Delivery;
  variant?: "card" | "row";
};

function CategoryIconDisplay({
  packageType,
  className,
}: {
  packageType: string;
  className?: string;
}) {
  const normalized = packageType.toLowerCase();
  if (normalized.includes("medicine")) return <IconMedicine className={className} />;
  if (normalized.includes("food")) return <IconFood className={className} />;
  if (normalized.includes("document")) return <IconDocument className={className} />;
  if (normalized.includes("parcel")) return <IconPackage className={className} />;
  if (normalized.includes("box")) return <IconBox className={className} />;
  return <IconPackage className={className} />;
}

const ACTIVE_STATUSES = [
  "booked",
  "driver_assigned",
  "picked_up",
  "in_transit",
] as const;

function StatusIcon({
  status,
  className,
}: {
  status: Delivery["status"];
  className?: string;
}) {
  if (status === "delivered") return <IconCheck className={className} />;
  if (status === "failed" || status === "cancelled")
    return <IconAlert className={className} />;
  if (ACTIVE_STATUSES.includes(status as (typeof ACTIVE_STATUSES)[number])) {
    return <IconTruck className={className} />;
  }
  return <IconClock className={className} />;
}

function getMobileStatusLabel(delivery: Delivery): string {
  if (delivery.status === "delivered") return "Delivered";
  if (delivery.status === "failed") return "Failed";
  if (delivery.status === "cancelled") return "Cancelled";
  if (ACTIVE_STATUSES.includes(delivery.status as (typeof ACTIVE_STATUSES)[number])) {
    return "Active";
  }
  return delivery.statusLabel;
}

export default function DeliveryCard({
  delivery,
  variant = "card",
}: DeliveryCardProps) {
  const partner = getPartnerMark(delivery.selectedService);
  const { date, time } = getListDateParts(delivery);

  const rowClass =
    variant === "row"
      ? "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-3 transition-colors hover:bg-surface/40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent sm:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] sm:gap-x-6 sm:px-5 sm:py-4"
      : "group rounded-lg border border-border bg-background shadow-sm transition-colors hover:border-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid sm:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] sm:items-center sm:gap-x-4 sm:px-5 sm:py-3.5";

  if (variant === "row") {
    return (
      <Link href={deliveryRoutePath(delivery.id)} className={rowClass}>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getCategoryIconBg(delivery.packageType)}`}
        >
          <CategoryIconDisplay
            packageType={delivery.packageType}
            className="h-[18px] w-[18px]"
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-small font-semibold text-foreground">
            {delivery.id}
          </p>
          <p className="truncate text-caption text-muted-foreground">
            {delivery.pickup.city} → {delivery.dropoff.city}
          </p>
          <p className="mt-0.5 truncate text-caption text-muted-foreground">
            {delivery.packageType} • {delivery.weight}
          </p>
        </div>

        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${partner.className}`}
            aria-hidden="true"
          >
            {partner.letter}
          </span>
          <div className="min-w-0">
            <p className="truncate text-caption font-medium text-foreground">
              {delivery.selectedService ?? "—"}
            </p>
            {delivery.pricing && (
              <p className="text-caption font-semibold text-foreground">
                {formatInr(delivery.pricing.total)}
              </p>
            )}
          </div>
        </div>

        <div className="hidden flex-col items-start gap-0.5 sm:flex">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusPillClasses(delivery.status)}`}
          >
            <StatusIcon status={delivery.status} className="h-3 w-3" />
            {delivery.statusLabel}
          </span>
          <p className="text-[11px] text-muted-foreground">
            {getStatusSubtext(delivery)}
          </p>
        </div>

        <div className="hidden items-center justify-end gap-2 sm:flex">
          <div className="text-right">
            <p className="text-caption font-medium text-foreground">{date}</p>
            {time && <p className="text-caption text-muted-foreground">{time}</p>}
          </div>
          <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        <div className="flex flex-col items-end gap-0.5 sm:hidden">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${getStatusPillClasses(delivery.status)}`}
          >
            <StatusIcon status={delivery.status} className="h-3 w-3" />
            {delivery.statusLabel}
          </span>
          <div className="text-right">
            <p className="text-[11px] font-medium text-foreground">{date}</p>
            {time && <p className="text-[11px] text-muted-foreground">{time}</p>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={deliveryRoutePath(delivery.id)} className={rowClass}>
      <div className="flex flex-col gap-2 px-3 py-3 sm:hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getCategoryIconBg(delivery.packageType)}`}
            >
              <CategoryIconDisplay
                packageType={delivery.packageType}
                className="h-4 w-4"
              />
            </div>
            <div className="min-w-0">
              <p className="text-small font-semibold text-foreground">{delivery.id}</p>
              <p className="mt-0.5 truncate text-caption text-muted-foreground">
                {delivery.pickup.city} → {delivery.dropoff.city}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusPillClasses(delivery.status)}`}
          >
            <StatusIcon status={delivery.status} className="h-3 w-3" />
            {getMobileStatusLabel(delivery)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-caption text-muted-foreground">
            {delivery.packageType} • {delivery.weight}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="text-right">
              <p className="whitespace-nowrap text-caption font-medium text-foreground">
                {date}
              </p>
              {time && (
                <p className="whitespace-nowrap text-caption text-muted-foreground">
                  {time}
                </p>
              )}
            </div>
            <IconChevronRight
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="hidden sm:contents">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getCategoryIconBg(delivery.packageType)}`}
        >
          <CategoryIconDisplay
            packageType={delivery.packageType}
            className="h-[18px] w-[18px]"
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-small font-semibold text-foreground">
            {delivery.id}
          </p>
          <p className="truncate text-caption text-muted-foreground">
            {delivery.pickup.city} → {delivery.dropoff.city}
          </p>
          <p className="mt-0.5 truncate text-caption text-muted-foreground">
            {delivery.packageType} • {delivery.weight}
          </p>
        </div>

        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${partner.className}`}
            aria-hidden="true"
          >
            {partner.letter}
          </span>
          <div className="min-w-0">
            <p className="truncate text-caption font-medium text-foreground">
              {delivery.selectedService ?? "—"}
            </p>
            {delivery.pricing && (
              <p className="text-caption font-semibold text-foreground">
                {formatInr(delivery.pricing.total)}
              </p>
            )}
          </div>
        </div>

        <div className="hidden flex-col items-start gap-0.5 sm:flex">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusPillClasses(delivery.status)}`}
          >
            <StatusIcon status={delivery.status} className="h-3 w-3" />
            {delivery.statusLabel}
          </span>
          <p className="text-[11px] text-muted-foreground">
            {getStatusSubtext(delivery)}
          </p>
        </div>

        <div className="hidden items-center justify-end gap-2 sm:flex">
          <div className="text-right">
            <p className="text-caption font-medium text-foreground">{date}</p>
            {time && <p className="text-caption text-muted-foreground">{time}</p>}
          </div>
          <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
