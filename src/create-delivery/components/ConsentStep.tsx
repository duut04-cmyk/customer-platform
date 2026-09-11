"use client";

import { PROHIBITED_ITEMS } from "@/compliance/prohibitedItems";
import type { DeliveryFormData } from "../types";
import { hasComplianceConsent } from "../types";

type ConsentStepProps = {
  data: DeliveryFormData;
  errors: Partial<Record<keyof DeliveryFormData, string>>;
  onChange: (updates: Partial<DeliveryFormData>) => void;
};

type ConsentCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  error?: string;
};

function ConsentCheckbox({ checked, onChange, children, error }: ConsentCheckboxProps) {
  return (
    <div className="space-y-1">
      <label className="flex cursor-default items-start gap-3 rounded-xl border border-border bg-background p-4 shadow-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border border-border bg-background transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
        >
          <svg
            viewBox="0 0 12 12"
            className={`h-3 w-3 shrink-0 text-white transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="cursor-default text-body text-foreground">{children}</span>
      </label>
      {error && (
        <p className="px-1 text-caption text-foreground" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function syncConsentTimestamp(
  data: DeliveryFormData,
  updates: Partial<DeliveryFormData>,
): Partial<DeliveryFormData> {
  const next = { ...data, ...updates };
  return {
    ...updates,
    consentAcceptedAt: hasComplianceConsent(next)
      ? next.consentAcceptedAt || new Date().toISOString()
      : "",
  };
}

export default function ConsentStep({ data, errors, onChange }: ConsentStepProps) {
  const handleFieldChange = (updates: Partial<DeliveryFormData>) => {
    onChange(syncConsentTimestamp(data, updates));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-body-lg font-bold text-foreground md:text-subheading">
          Safety & compliance
        </h2>
        <p className="text-body text-muted-foreground">
          Please read and confirm the following before continuing.
        </p>
      </div>

      <div className="space-y-4">
        <section
          className="rounded-xl border border-border bg-surface/40 p-5 text-small leading-relaxed text-muted-foreground"
          aria-labelledby="consent-prohibited-heading"
        >
          <h3
            id="consent-prohibited-heading"
            className="mb-2 text-body font-semibold text-foreground"
          >
            Prohibited items
          </h3>
          <p>
            Doot deliveries must not contain illegal or restricted items. Your package
            must not include:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 sm:columns-2 sm:gap-x-6">
            {PROHIBITED_ITEMS.map((item) => (
              <li key={item} className="break-inside-avoid">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-xl border border-border bg-surface/40 p-5 text-small leading-relaxed text-muted-foreground"
          aria-labelledby="consent-valuables-heading"
        >
          <h3
            id="consent-valuables-heading"
            className="mb-2 text-body font-semibold text-foreground"
          >
            Valuables & high-value items
          </h3>
          <p>
            Jewelry, precious metals, gems, watches, electronics, and other high-value
            items are sent at your sole risk. Doot and its delivery partners do not
            provide insurance for such items unless separate declared-value coverage is
            purchased and confirmed.
          </p>
          <p className="mt-2">
            Doot is not responsible for theft, loss, damage, or deterioration of
            valuable contents. You are responsible for secure packaging and accurate
            declaration.
          </p>
        </section>

        <section
          className="rounded-xl border border-border bg-surface/40 p-5 text-small leading-relaxed text-muted-foreground"
          aria-labelledby="consent-responsibility-heading"
        >
          <h3
            id="consent-responsibility-heading"
            className="mb-2 text-body font-semibold text-foreground"
          >
            Your responsibilities
          </h3>
          <ul className="space-y-1.5">
            <li>Contents are legal and accurately described in this booking.</li>
            <li>Photos reflect the actual item being delivered.</li>
            <li>Packaging is adequate and safe for handlers and recipients.</li>
            <li>You will not misdeclare contents to avoid restrictions or fees.</li>
            <li>
              You indemnify Doot against claims arising from illegal, prohibited, or
              misdeclared shipments.
            </li>
          </ul>
        </section>

        <section
          className="rounded-xl border border-border bg-surface/40 p-5 text-small leading-relaxed text-muted-foreground"
          aria-labelledby="consent-platform-heading"
        >
          <h3
            id="consent-platform-heading"
            className="mb-2 text-body font-semibold text-foreground"
          >
            Platform role & liability
          </h3>
          <p>
            Doot finds and books delivery services on your behalf. Physical pickup,
            transit, and delivery are performed by independent third-party partners.
            Doot does not inspect package contents and is not liable for partner acts or
            omissions except as required by applicable law.
          </p>
          <p className="mt-2">
            To the extent permitted by law, Doot&apos;s liability is limited to the
            delivery fee paid for the booking unless separate insurance applies.
          </p>
          <p className="mt-3 text-caption italic">
            Placeholder legal text — pending formal legal review.
          </p>
        </section>
      </div>

      <ConsentCheckbox
        checked={data.complianceConsent}
        onChange={(checked) => handleFieldChange({ complianceConsent: checked })}
        error={errors.complianceConsent}
      >
        I have read and agree to all of the above: my package contains no prohibited
        items; I understand valuables are sent at my own risk and Doot is not
        responsible for theft, loss, or damage; my description and photos are accurate;
        my packaging is adequate; and I accept full responsibility for this shipment.
      </ConsentCheckbox>
    </div>
  );
}

export function validateConsentStep(
  data: DeliveryFormData,
): Partial<Record<keyof DeliveryFormData, string>> {
  const errors: Partial<Record<keyof DeliveryFormData, string>> = {};
  if (!data.complianceConsent) {
    errors.complianceConsent =
      "You must agree to the safety and compliance terms before continuing.";
  }
  return errors;
}
