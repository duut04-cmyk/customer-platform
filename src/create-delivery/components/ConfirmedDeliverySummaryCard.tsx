import type { ReactNode } from "react";
import {
  IconClockFilled,
  IconGridFilled,
  IconMapPinFilled,
  IconPackageFilled,
} from "@/dashboard/components/icons";
import { getPartnerMark } from "@/utils/deliveryDisplayHelpers";
import { formatTimingSummary, PACKAGE_LABELS, type DeliveryFormData } from "../types";
import { getPackageDetailsSummary } from "./YourDeliverySummaryCard";

type SummaryRowProps = {
  icon: ReactNode;
  iconBgClassName: string;
  label: string;
  value: string;
  showDivider?: boolean;
};

function SummaryRow({
  icon,
  iconBgClassName,
  label,
  value,
  showDivider = false,
}: SummaryRowProps) {
  return (
    <div className="py-3 first:pt-2 last:pb-4">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBgClassName}`}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-caption font-medium text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-small font-medium text-foreground">{value}</p>
        </div>
      </div>
      {showDivider ? (
        <div className="ml-12 mr-3 mt-3 border-b border-border/70" aria-hidden="true" />
      ) : null}
    </div>
  );
}

type ConfirmedDeliverySummaryCardProps = {
  data: DeliveryFormData;
  serviceName: string;
};

export default function ConfirmedDeliverySummaryCard({
  data,
  serviceName,
}: ConfirmedDeliverySummaryCardProps) {
  const partner = getPartnerMark(serviceName);

  const rows: SummaryRowProps[] = [
    {
      icon: <IconGridFilled className="h-4 w-4 text-violet-600" />,
      iconBgClassName: "bg-violet-50",
      label: "Category",
      value: data.packageType ? PACKAGE_LABELS[data.packageType] : "Not selected",
    },
    {
      icon: <IconMapPinFilled className="h-4 w-4 text-accent" />,
      iconBgClassName: "bg-[#fff7ed]",
      label: "Pickup location",
      value: data.pickupAddress.trim() || "Not specified",
    },
    {
      icon: <IconMapPinFilled className="h-4 w-4 text-blue-600" />,
      iconBgClassName: "bg-blue-50",
      label: "Drop-off location",
      value: data.dropAddress.trim() || "Not specified",
    },
    {
      icon: <IconPackageFilled className="h-4 w-4 text-violet-600" />,
      iconBgClassName: "bg-violet-50",
      label: "Package details",
      value: getPackageDetailsSummary(data),
    },
    {
      icon: <IconClockFilled className="h-4 w-4 text-emerald-600" />,
      iconBgClassName: "bg-emerald-50",
      label: "Delivery timing",
      value: formatTimingSummary(data),
    },
    {
      icon: (
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${partner.className}`}
          aria-hidden="true"
        >
          {partner.letter}
        </span>
      ),
      iconBgClassName: "bg-emerald-50",
      label: "Service",
      value: serviceName,
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-foreground">
            <IconPackageFilled className="h-5 w-5 text-violet-600" />
          </span>
          <div>
            <h3 className="text-body font-bold text-foreground">Delivery summary</h3>
            <p className="mt-0.5 text-caption text-muted-foreground">
              Your booked delivery details
            </p>
          </div>
        </div>
      </div>

      <div className="px-4">
        {rows.map((row, index) => (
          <SummaryRow
            key={row.label}
            icon={row.icon}
            iconBgClassName={row.iconBgClassName}
            label={row.label}
            value={row.value}
            showDivider={index < rows.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
