import {
  DOOT_PLATFORM_FEE_PERCENT,
  GST_PERCENT,
  formatInr,
  type DeliveryPricing,
} from "@/deliveries/pricing";

type PricingBreakdownProps = {
  pricing: DeliveryPricing;
  className?: string;
  showNote?: boolean;
  heading?: string;
  embedded?: boolean;
};

function PricingLine({
  label,
  helper,
  value,
  bold = false,
}: {
  label: string;
  helper?: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p
          className={
            bold
              ? "text-body font-semibold text-foreground"
              : "text-body text-foreground"
          }
        >
          {label}
        </p>
        {helper && (
          <p className="mt-0.5 text-caption text-muted-foreground">{helper}</p>
        )}
      </div>
      <p
        className={`shrink-0 tabular-nums ${
          bold ? "text-body-lg font-bold text-foreground" : "text-body text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function PricingBreakdown({
  pricing,
  className = "",
  showNote = false,
  heading = "Price breakdown",
  embedded = false,
}: PricingBreakdownProps) {
  const content = (
    <>
      {!embedded && (
        <h3
          id="delivery-pricing-heading"
          className="text-body-lg font-bold text-foreground"
        >
          {heading}
        </h3>
      )}

      {embedded && (
        <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          {heading}
        </h3>
      )}

      <dl
        className={`space-y-4 ${embedded ? "mt-4" : "mt-5"}`}
        aria-labelledby={embedded ? undefined : "delivery-pricing-heading"}
      >
        <PricingLine
          label="Delivery charge"
          helper="Charged by delivery partner"
          value={formatInr(pricing.thirdPartyCharge)}
        />
        <PricingLine
          label="Doot platform fee"
          helper={`${DOOT_PLATFORM_FEE_PERCENT}% platform fee`}
          value={formatInr(pricing.platformFeeAmount)}
        />
        <PricingLine
          label="GST"
          helper={`${GST_PERCENT}% GST`}
          value={formatInr(pricing.gstAmount)}
        />
        <div className="border-t border-border pt-4">
          <PricingLine label="Total" value={formatInr(pricing.total)} bold />
        </div>
      </dl>

      {showNote && (
        <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
          Nothing is booked until you confirm. The delivery charge is set by the
          delivery partner. Doot adds a {DOOT_PLATFORM_FEE_PERCENT}% platform fee. GST
          is calculated at {GST_PERCENT}%.
        </p>
      )}
    </>
  );

  if (embedded) {
    return <div className={className}>{content}</div>;
  }

  return (
    <section
      className={`rounded-xl border border-border bg-background p-6 shadow-sm ${className}`}
      aria-labelledby="delivery-pricing-heading"
    >
      {content}
    </section>
  );
}
