"use client";

import { useState, type ReactNode } from "react";
import Input from "@/common/components/Input";
import {
  IconCheck,
  IconChevronDown,
  IconDocumentFilled,
  IconFoodFilled,
  IconMedicineFilled,
  IconOtherFilled,
} from "@/dashboard/components/icons";
import type { DeliveryFormData, PackageType } from "../types";
import { isDimensionsOptional, MIN_PACKAGE_PHOTOS, PACKAGE_LABELS } from "../types";
import PackagePhotoUpload from "./PackagePhotoUpload";
import WhyWeNeedPhotosPanel from "./WhyWeNeedPhotosPanel";

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
}[] = [
  {
    id: "medicine",
    label: "Medicine",
    description: "Pharmaceuticals & medical items",
    Icon: IconMedicineFilled,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    selectedBorder: "border-emerald-500",
    selectedBg: "bg-emerald-50",
    checkmarkBg: "bg-emerald-500",
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
  },
  {
    id: "document",
    label: "Documents",
    description: "Papers & envelopes",
    Icon: IconDocumentFilled,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    selectedBorder: "border-violet-500",
    selectedBg: "bg-violet-50",
    checkmarkBg: "bg-violet-500",
  },
  {
    id: "other",
    label: "Other",
    description: "Packed goods or cartons",
    Icon: IconOtherFilled,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    selectedBorder: "border-blue-500",
    selectedBg: "bg-blue-50",
    checkmarkBg: "bg-blue-500",
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

export default function PackageStep({ data, errors, onChange }: PackageStepProps) {
  const dimensionsOptional = isDimensionsOptional(data.packageType);
  const hasDimensionErrors = !!(errors.length || errors.width || errors.height);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isDetailsExpanded = detailsOpen || hasDimensionErrors;

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-body-lg font-bold text-foreground">
            What are you sending?
          </h2>
          <p className="text-caption text-muted-foreground">
            Choose a category and add photos so we can handle your delivery safely.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {packageOptions.map((option) => {
            const selected = data.packageType === option.id;
            const { Icon } = option;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ packageType: option.id as PackageType })}
                className={`relative cursor-pointer rounded-xl border-2 px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  selected
                    ? `${option.selectedBorder} ${option.selectedBg} shadow-sm`
                    : "border-border bg-white shadow-sm hover:border-foreground/20"
                }`}
              >
                {selected ? (
                  <span
                    className={`absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-white ${option.checkmarkBg}`}
                  >
                    <IconCheck className="h-3 w-3 stroke-[2.5]" />
                  </span>
                ) : null}
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${option.iconBg} ${option.iconColor}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-2 text-small font-semibold text-foreground">
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
      </section>

      <section className="space-y-3 border-t border-border pt-6">
        <div className="space-y-1">
          <h3 className="text-small font-semibold text-foreground">
            Package photos{" "}
            <span className="font-normal text-muted-foreground">(required)</span>
          </h3>
          <p className="text-caption text-muted-foreground">
            Add clear photos of the item from different angles.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,1fr)] lg:items-stretch">
          <PackagePhotoUpload
            value={data.packagePhotoUrls}
            onChange={(urls) => onChange({ packagePhotoUrls: urls })}
            error={errors.packagePhotoUrls as string | undefined}
          />
          <WhyWeNeedPhotosPanel />
        </div>
      </section>

      <section className="border-y border-border">
        <button
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          className="flex w-full cursor-pointer items-start gap-3 py-4 text-left transition-colors hover:bg-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-expanded={isDetailsExpanded}
        >
          <IconChevronDown
            className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isDetailsExpanded ? "rotate-180" : ""}`}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-body font-semibold text-foreground">
              Additional details{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </span>
            <span className="mt-0.5 block text-small text-muted-foreground">
              Add dimensions and weight for better accuracy.
            </span>
          </span>
        </button>

        {isDetailsExpanded ? (
          <div className="space-y-6 border-t border-border pb-5 pl-7 pr-1 pt-5">
            <div>
              <FieldLabel>
                Dimensions{" "}
                {dimensionsOptional ? (
                  <span className="font-normal text-muted-foreground">(optional)</span>
                ) : data.packageType ? (
                  <span className="font-normal text-muted-foreground">(required)</span>
                ) : null}
              </FieldLabel>
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

            <div className="max-w-xs">
              <FieldLabel htmlFor="weight">
                Weight{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <p className="mb-3 text-caption text-muted-foreground">Unit: kg</p>
              <Input
                id="weight"
                inputMode="decimal"
                placeholder="2.5"
                value={data.weight}
                onChange={(e) => onChange({ weight: e.target.value })}
              />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export function validatePackageStep(
  data: DeliveryFormData,
): Partial<Record<keyof DeliveryFormData, string>> {
  const errors: Partial<Record<keyof DeliveryFormData, string>> = {};
  if (!data.packageType) errors.packageType = "Select an item category.";
  if (data.packagePhotoUrls.length < MIN_PACKAGE_PHOTOS) {
    errors.packagePhotoUrls = `Add at least ${MIN_PACKAGE_PHOTOS} package photos.`;
  }

  if (!isDimensionsOptional(data.packageType)) {
    if (!data.length.trim()) errors.length = "Required.";
    if (!data.width.trim()) errors.width = "Required.";
    if (!data.height.trim()) errors.height = "Required.";
  }

  return errors;
}

export { PACKAGE_LABELS };
