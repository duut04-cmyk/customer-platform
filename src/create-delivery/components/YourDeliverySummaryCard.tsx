import type { ReactNode } from "react";
import {
  IconClockFilled,
  IconGridFilled,
  IconMapPinFilled,
  IconPackageFilled,
} from "@/dashboard/components/icons";
import {
  formatDimensions,
  formatPackageSizeSummary,
  formatTimingSummary,
  formatWeight,
  PACKAGE_LABELS,
  type DeliveryFormData,
  type ProgressStep,
} from "../types";

type SummaryRowProps = {
  icon: ReactNode;
  iconBgClassName: string;
  label: string;
  value: string;
  emptyValue: string;
  showDivider?: boolean;
};

function SummaryRow({
  icon,
  iconBgClassName,
  label,
  value,
  emptyValue,
  showDivider = false,
}: SummaryRowProps) {
  const isEmpty = value === emptyValue;

  return (
    <div className="py-2.5 first:pt-3 last:pb-3 sm:py-3 sm:first:pt-4 sm:last:pb-4">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9 ${iconBgClassName}`}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-caption font-medium text-muted-foreground">{label}</p>
          <p
            className={`mt-0.5 break-words text-caption sm:text-small ${isEmpty ? "text-muted-foreground" : "font-medium text-foreground"}`}
          >
            {value}
          </p>
        </div>
      </div>
      {showDivider ? (
        <div
          className="ml-10 mt-2.5 border-b border-border/70 sm:ml-12 sm:mt-3"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

function getCategorySummary(data: DeliveryFormData): string {
  if (!data.packageType) return "Not selected";
  return PACKAGE_LABELS[data.packageType];
}

function getPackageDetailsSummary(data: DeliveryFormData): string {
  const parts: string[] = [];

  if (data.packageSizeTier) {
    parts.push(formatPackageSizeSummary(data));
  }

  if (data.packageDescription.trim()) {
    parts.push(data.packageDescription.trim());
  }

  if (data.packagePhotoUrls.length > 0) {
    parts.push(
      `${data.packagePhotoUrls.length} photo${data.packagePhotoUrls.length === 1 ? "" : "s"}`,
    );
  }

  const dimensions = formatDimensions(data);
  if (dimensions !== "Not provided") {
    parts.push(dimensions);
  }

  const weight = formatWeight(data);
  if (weight !== "Not provided") {
    parts.push(weight);
  }

  if (parts.length > 0) return parts.join(" · ");
  return "Not specified";
}

function getTimingSummary(data: DeliveryFormData): string {
  return formatTimingSummary(data);
}

type SummaryRowConfig = {
  icon: ReactNode;
  iconBgClassName: string;
  label: string;
  value: string;
  emptyValue: string;
};

type YourDeliverySummaryCardProps = {
  data: DeliveryFormData;
  currentStep?: ProgressStep;
};

function buildRows(
  data: DeliveryFormData,
  currentStep?: ProgressStep,
): SummaryRowConfig[] {
  const pickupRow: SummaryRowConfig = {
    icon: <IconMapPinFilled className="h-4 w-4 text-accent" />,
    iconBgClassName: "bg-[#fff7ed]",
    label: "Pickup location",
    value: data.pickupAddress.trim() || "Not specified",
    emptyValue: "Not specified",
  };

  const dropoffRow: SummaryRowConfig = {
    icon: <IconMapPinFilled className="h-4 w-4 text-blue-600" />,
    iconBgClassName: "bg-blue-50",
    label: "Drop-off location",
    value: data.dropAddress.trim() || "Not specified",
    emptyValue: "Not specified",
  };

  const categoryRow: SummaryRowConfig = {
    icon: <IconGridFilled className="h-4 w-4 text-violet-600" />,
    iconBgClassName: "bg-violet-50",
    label: "Category",
    value: getCategorySummary(data),
    emptyValue: "Not selected",
  };

  const packageDetailsRow: SummaryRowConfig = {
    icon: <IconPackageFilled className="h-4 w-4 text-violet-600" />,
    iconBgClassName: "bg-violet-50",
    label: "Package details",
    value: getPackageDetailsSummary(data),
    emptyValue: "Not specified",
  };

  const timingRow: SummaryRowConfig = {
    icon: <IconClockFilled className="h-4 w-4 text-emerald-600" />,
    iconBgClassName: "bg-emerald-50",
    label: "Delivery timing",
    value: getTimingSummary(data),
    emptyValue: "Not specified",
  };

  if (currentStep === "package") {
    return [categoryRow, pickupRow, dropoffRow, packageDetailsRow];
  }

  if (currentStep === "pickup") {
    return [pickupRow, dropoffRow, packageDetailsRow, timingRow];
  }

  return [categoryRow, pickupRow, dropoffRow, packageDetailsRow, timingRow];
}

export default function YourDeliverySummaryCard({
  data,
  currentStep,
}: YourDeliverySummaryCardProps) {
  const rows = buildRows(data, currentStep);

  return (
    <section className="min-w-0 w-full max-w-full overflow-hidden rounded-xl border border-border bg-background">
      <div className="bg-[#fff7ed] px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm sm:h-10 sm:w-10">
            <IconPackageFilled className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-small font-bold text-foreground sm:text-body">
              Your delivery
            </h3>
            <p className="mt-0.5 text-caption text-muted-foreground">
              Quick summary of your delivery details.
            </p>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4">
        {rows.map((row, index) => (
          <SummaryRow
            key={row.label}
            icon={row.icon}
            iconBgClassName={row.iconBgClassName}
            label={row.label}
            value={row.value}
            emptyValue={row.emptyValue}
            showDivider={index < rows.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

export { getPackageDetailsSummary, getCategorySummary };
