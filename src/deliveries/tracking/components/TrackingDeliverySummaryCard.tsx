import type { ReactNode } from "react";
import {
  IconClockFilled,
  IconGridFilled,
  IconMapPinFilled,
  IconPackageFilled,
} from "@/dashboard/components/icons";
import type { Delivery } from "../../types";

type TrackingDeliverySummaryCardProps = {
  delivery: Delivery;
};

function getPackagePhotos(delivery: Delivery): string[] {
  if (delivery.packagePhotoUrls && delivery.packagePhotoUrls.length > 0) {
    return delivery.packagePhotoUrls;
  }
  if (delivery.packagePhotoUrl) {
    return [delivery.packagePhotoUrl];
  }
  return [];
}

function SummaryRow({
  icon,
  iconBgClassName,
  label,
  children,
  showDivider = false,
}: {
  icon: React.ReactNode;
  iconBgClassName: string;
  label: string;
  children: ReactNode;
  showDivider?: boolean;
}) {
  return (
    <div className="py-3 first:pt-4 last:pb-4">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBgClassName}`}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-caption font-medium text-muted-foreground">{label}</p>
          <div className="mt-0.5">{children}</div>
        </div>
      </div>
      {showDivider ? (
        <div className="ml-12 mr-3 mt-3 border-b border-border/70" aria-hidden="true" />
      ) : null}
    </div>
  );
}

export default function TrackingDeliverySummaryCard({
  delivery,
}: TrackingDeliverySummaryCardProps) {
  const photos = getPackagePhotos(delivery);
  const timing =
    delivery.pickupWindowLabel ??
    `${delivery.estimatedDeliveryLabel ?? delivery.dateLabel}, ${delivery.estimatedArrival}`;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="bg-[#fff7ed] px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm">
            <IconPackageFilled className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-body font-bold text-foreground">Delivery summary</h3>
            <p className="mt-0.5 text-caption text-muted-foreground">
              Quick summary of your delivery details.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <SummaryRow
          icon={<IconGridFilled className="h-4 w-4 text-violet-600" />}
          iconBgClassName="bg-violet-50"
          label="Category"
          showDivider
        >
          <p className="text-small font-medium text-foreground">
            {delivery.packageType}
          </p>
        </SummaryRow>

        <SummaryRow
          icon={<IconMapPinFilled className="h-4 w-4 text-accent" />}
          iconBgClassName="bg-[#fff7ed]"
          label="Pickup location"
          showDivider
        >
          <p className="text-small font-medium text-foreground">
            {delivery.pickup.address}
          </p>
        </SummaryRow>

        <SummaryRow
          icon={<IconMapPinFilled className="h-4 w-4 text-blue-600" />}
          iconBgClassName="bg-blue-50"
          label="Drop-off location"
          showDivider
        >
          <p className="text-small font-medium text-foreground">
            {delivery.dropoff.address}
          </p>
        </SummaryRow>

        <SummaryRow
          icon={<IconPackageFilled className="h-4 w-4 text-violet-600" />}
          iconBgClassName="bg-violet-50"
          label="Package details"
          showDivider
        >
          <p className="text-small font-medium text-foreground">
            {delivery.weight} · {delivery.dimensions}
          </p>
          {photos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {photos.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="h-14 w-14 overflow-hidden rounded-lg border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Package photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </SummaryRow>

        <SummaryRow
          icon={<IconClockFilled className="h-4 w-4 text-emerald-600" />}
          iconBgClassName="bg-emerald-50"
          label="Delivery timing"
        >
          <p className="text-small font-medium text-foreground">{timing}</p>
        </SummaryRow>
      </div>
    </section>
  );
}
