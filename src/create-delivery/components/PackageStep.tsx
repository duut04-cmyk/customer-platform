"use client";

import { useEffect, type ReactNode } from "react";
import Input from "@/common/components/Input";
import {
  IconCheck,
  IconDocumentFilled,
  IconFoodFilled,
  IconFragile,
  IconHandCare,
  IconKeepUpright,
  IconMedicineFilled,
  IconOtherFilled,
  IconRequirementNone,
} from "@/dashboard/components/icons";
import type { DeliveryFormData, PackageSizeTier, PackageType } from "../types";
import {
  getDefaultPackageSizeTier,
  getPackageDescriptionPlaceholder,
  getPackageSizeHelperText,
  getPackageWeightFieldError,
  isPackageSizeTierAllowed,
  MAX_PACKAGE_DESCRIPTION_LENGTH,
  PACKAGE_LABELS,
  PACKAGE_SIZE_TIER_LABELS,
  REQUIREMENT_OPTIONS,
  requiresPackageDescription,
  requiresPackageDimensions,
  requiresPackageWeight,
  validatePackageFields,
} from "../types";
import PackagePhotoUpload from "./PackagePhotoUpload";
import Textarea from "./Textarea";
import WhyWeNeedPhotosPanel from "./WhyWeNeedPhotosPanel";

const requirementIcons = {
  "handle-with-care": IconHandCare,
  fragile: IconFragile,
  "keep-upright": IconKeepUpright,
  none: IconRequirementNone,
} as const;

type CategoryId = "medicine" | "food" | "document" | "other";

const packageOptions: {
  id: CategoryId;
  label: string;
  description: string;
  Icon: typeof IconMedicineFilled;
  iconBg: string;
  iconColor: string;
  selectedBorder: string;
  selectedBg: string;
  checkmarkBg: string;
  accentBar: string;
}[] = [
  {
    id: "medicine",
    label: "Medicine",
    description: "Pharmaceuticals & medical items",
    Icon: IconMedicineFilled,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    selectedBorder: "border-emerald-500",
    selectedBg: "bg-emerald-50/80",
    checkmarkBg: "bg-emerald-500",
    accentBar: "bg-emerald-500",
  },
  {
    id: "food",
    label: "Food",
    description: "Meals & food items",
    Icon: IconFoodFilled,
    iconBg: "bg-[#fff7ed]",
    iconColor: "text-accent",
    selectedBorder: "border-accent",
    selectedBg: "bg-[#fff7ed]",
    checkmarkBg: "bg-accent",
    accentBar: "bg-accent",
  },
  {
    id: "document",
    label: "Documents",
    description: "Papers & envelopes",
    Icon: IconDocumentFilled,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    selectedBorder: "border-violet-500",
    selectedBg: "bg-violet-50/80",
    checkmarkBg: "bg-violet-500",
    accentBar: "bg-violet-500",
  },
  {
    id: "other",
    label: "Other",
    description: "Packed goods or cartons",
    Icon: IconOtherFilled,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    selectedBorder: "border-blue-500",
    selectedBg: "bg-blue-50/80",
    checkmarkBg: "bg-blue-500",
    accentBar: "bg-blue-500",
  },
];

const sizeTierOptions: {
  id: Exclude<PackageSizeTier, "">;
  description: string;
}[] = [
  {
    id: "small",
    description: "Fits in a bag or envelope",
  },
  {
    id: "medium",
    description: "Hand-carry box or bag",
  },
  {
    id: "large",
    description: "Heavy or bulky — exact size needed",
  },
];

type PackageStepProps = {
  data: DeliveryFormData;
  errors: Partial<Record<keyof DeliveryFormData, string>>;
  onChange: (updates: Partial<DeliveryFormData>) => void;
};

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-small font-medium text-foreground"
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-caption text-red-600" role="alert">
      {message}
    </p>
  );
}

function SectionCard({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[10px] border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)] sm:p-5 md:p-6">
      <div className="mb-4 md:mb-5">
        <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-body font-bold text-foreground md:text-body-lg">
          {title}
        </h3>
        <p className="mt-0.5 text-caption text-muted-foreground md:text-small">
          {subtitle}
        </p>
      </div>
      {children}
    </section>
  );
}

export default function PackageStep({ data, errors, onChange }: PackageStepProps) {
  const showDimensions = requiresPackageDimensions(data);
  const weightRequired = requiresPackageWeight(data);
  const descriptionRequired = requiresPackageDescription(data);
  const weightError = errors.weight ?? getPackageWeightFieldError(data);

  useEffect(() => {
    if (
      data.timing === "asap" &&
      !data.scheduledAt &&
      !data.scheduledDate &&
      !data.pickupWindowStart &&
      !data.pickupWindowEnd
    ) {
      return;
    }
    onChange({
      timing: "asap",
      scheduledAt: "",
      scheduledDate: "",
      pickupWindowStart: "",
      pickupWindowEnd: "",
    });
    // Normalize once when entering package step / restoring drafts.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount + timing normalize
  }, []);

  function handleCategorySelect(packageType: CategoryId) {
    const defaultTier = getDefaultPackageSizeTier(packageType);
    const nextTier =
      data.packageSizeTier &&
      isPackageSizeTierAllowed(packageType, data.packageSizeTier)
        ? data.packageSizeTier
        : defaultTier;

    onChange({
      packageType: packageType as PackageType,
      packageSizeTier: nextTier,
    });
  }

  function handleSizeTierSelect(tier: Exclude<PackageSizeTier, "">) {
    onChange({ packageSizeTier: tier });
  }

  const toggleRequirement = (id: string) => {
    if (id === "none") {
      onChange({ requirements: ["none"] });
      return;
    }

    const withoutNone = data.requirements.filter((r) => r !== "none");
    const next = withoutNone.includes(id)
      ? withoutNone.filter((r) => r !== id)
      : [...withoutNone, id];
    onChange({ requirements: next });
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <div>
        <h2 className="text-body-lg font-bold tracking-tight text-foreground">
          What&apos;s in this delivery?
        </h2>
        <p className="mt-1 text-small text-muted-foreground">
          Choose a category, add photos, and pick a size so we can quote and handle your
          package safely.
        </p>
      </div>

      <SectionCard
        eyebrow="Category"
        title="What are you sending?"
        subtitle="Select the option that best matches your item."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {packageOptions.map((option) => {
            const selected = data.packageType === option.id;
            const { Icon } = option;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleCategorySelect(option.id)}
                className={`relative cursor-pointer overflow-hidden rounded-[6px] border-2 px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  selected
                    ? `${option.selectedBorder} ${option.selectedBg} shadow-sm`
                    : "border-border bg-[#FFFBF5]/80 shadow-sm hover:border-foreground/20"
                }`}
              >
                {selected ? (
                  <>
                    <span
                      className={`absolute inset-y-0 left-0 w-1 ${option.accentBar}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-white ${option.checkmarkBg}`}
                    >
                      <IconCheck className="h-3 w-3 stroke-[2.5]" />
                    </span>
                  </>
                ) : null}
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-[8px] ${option.iconBg} ${option.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-2.5 text-small font-semibold text-foreground">
                  {option.label}
                </p>
                <p className="mt-0.5 text-caption leading-snug text-muted-foreground">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.packageType} />
      </SectionCard>

      <SectionCard
        eyebrow="Photos"
        title="Package photos"
        subtitle="Add clear photos of the item from different angles (required)."
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.95fr)] lg:items-stretch">
          <PackagePhotoUpload
            photos={data.packagePhotos}
            uploadBatchId={data.photoUploadBatchId}
            onChange={(packagePhotos) => onChange({ packagePhotos })}
            error={errors.packagePhotos as string | undefined}
          />
          <WhyWeNeedPhotosPanel />
        </div>
      </SectionCard>

      {data.packageType ? (
        <SectionCard
          eyebrow="Details"
          title="What's inside?"
          subtitle={
            descriptionRequired
              ? "Required for packed goods so the driver knows what to expect."
              : "Optional — helps the driver and our team handle your item safely."
          }
        >
          <Textarea
            id="packageDescription"
            value={data.packageDescription}
            onChange={(event) => onChange({ packageDescription: event.target.value })}
            placeholder={getPackageDescriptionPlaceholder(data.packageType)}
            maxLength={MAX_PACKAGE_DESCRIPTION_LENGTH}
            error={!!errors.packageDescription}
            className="min-h-24 resize-none rounded-[6px]! text-small"
          />
          <FieldError message={errors.packageDescription} />
        </SectionCard>
      ) : null}

      <SectionCard
        eyebrow="Size"
        title="Package size"
        subtitle={getPackageSizeHelperText(data)}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {sizeTierOptions.map((option) => {
            const disabled =
              !!data.packageType &&
              !isPackageSizeTierAllowed(data.packageType, option.id);
            const selected = data.packageSizeTier === option.id;

            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => handleSizeTierSelect(option.id)}
                className={`relative cursor-pointer overflow-hidden rounded-[6px] border-2 px-3.5 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-45 ${
                  selected
                    ? "border-accent bg-[#fff7ed] shadow-sm"
                    : "border-border bg-[#FFFBF5]/80 shadow-sm hover:border-foreground/20"
                }`}
              >
                {selected ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-accent"
                    aria-hidden="true"
                  />
                ) : null}
                <p className="text-small font-semibold text-foreground">
                  {PACKAGE_SIZE_TIER_LABELS[option.id]}
                </p>
                <p className="mt-1 text-caption leading-snug text-muted-foreground">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.packageSizeTier} />

        {data.packageSizeTier ? (
          <div className="mt-5 space-y-5 rounded-[10px] border border-accent/15 bg-[#FFF8F1] p-4 md:p-5">
            <div className="max-w-xs">
              <FieldLabel htmlFor="weight">Weight</FieldLabel>
              <p className="mb-3 text-caption text-muted-foreground">
                Unit: kg
                {weightRequired ? "" : " — optional for small items"}
              </p>
              <Input
                id="weight"
                inputMode="decimal"
                placeholder={weightRequired ? "2.5" : "0.5"}
                value={data.weight}
                onChange={(e) => onChange({ weight: e.target.value })}
                error={!!weightError}
              />
              <FieldError message={weightError} />
            </div>

            {showDimensions ? (
              <div>
                <FieldLabel>Dimensions</FieldLabel>
                <p className="mb-3 text-caption text-muted-foreground">Unit: cm</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <FieldLabel htmlFor="length">Length</FieldLabel>
                    <Input
                      id="length"
                      inputMode="decimal"
                      placeholder="30"
                      value={data.length}
                      onChange={(e) => onChange({ length: e.target.value })}
                      error={!!errors.length}
                    />
                    <FieldError message={errors.length} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="width">Width</FieldLabel>
                    <Input
                      id="width"
                      inputMode="decimal"
                      placeholder="20"
                      value={data.width}
                      onChange={(e) => onChange({ width: e.target.value })}
                      error={!!errors.width}
                    />
                    <FieldError message={errors.width} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="height">Height</FieldLabel>
                    <Input
                      id="height"
                      inputMode="decimal"
                      placeholder="15"
                      value={data.height}
                      onChange={(e) => onChange({ height: e.target.value })}
                      error={!!errors.height}
                    />
                    <FieldError message={errors.height} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        eyebrow="Handling"
        title="Special requirements"
        subtitle="Tell us how this package should be handled."
      >
        <div className="flex flex-wrap gap-2">
          {REQUIREMENT_OPTIONS.map((option) => {
            const selected = data.requirements.includes(option.id);
            const ReqIcon = requirementIcons[option.id];
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleRequirement(option.id)}
                className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-caption transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  selected
                    ? "border-accent bg-[#fff7ed] font-medium text-foreground"
                    : "border-border bg-[#FFFBF5] font-normal text-muted-foreground hover:border-foreground/25"
                }`}
              >
                <ReqIcon
                  className={`h-3.5 w-3.5 shrink-0 ${selected ? "text-accent" : "text-muted-foreground"}`}
                />
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <label
            htmlFor="instructions"
            className="mb-2 block text-small font-semibold text-foreground"
          >
            Additional instructions{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            id="instructions"
            placeholder="Any extra details for the delivery..."
            value={data.instructions}
            onChange={(e) => onChange({ instructions: e.target.value })}
            className="min-h-28 resize-none rounded-[6px]! text-small"
          />
        </div>
      </SectionCard>
    </div>
  );
}

export function validatePackageStep(
  data: DeliveryFormData,
): Partial<Record<keyof DeliveryFormData, string>> {
  const errors = validatePackageFields(data);
  if (data.timing && data.timing !== "asap") {
    errors.timing = "Only as-soon-as-possible deliveries are available.";
  }
  return errors;
}

export { PACKAGE_LABELS };
