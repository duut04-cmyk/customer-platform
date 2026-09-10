import type { ReactNode } from "react";
import {
  IconGridFilled,
  IconMapPinFilled,
  IconPackageFilled,
  IconTruck,
} from "@/dashboard/components/icons";
import { getPackageDetailsSummary } from "./YourDeliverySummaryCard";
import { PACKAGE_LABELS, type DeliveryFormData } from "../types";

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

function getServiceLabel(data: DeliveryFormData): string {
  if (data.timing === "asap") return "Express delivery";
  return "Standard delivery";
}

type FindingDeliverySummaryCardProps = {
  data: DeliveryFormData;
};

export default function FindingDeliverySummaryCard({
  data,
}: FindingDeliverySummaryCardProps) {
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
      icon: <IconTruck className="h-4 w-4 text-teal-600" />,
      iconBgClassName: "bg-teal-50",
      label: "Service",
      value: getServiceLabel(data),
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
              Details used for provider matching
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
