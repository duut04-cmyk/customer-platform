import { getPartnerMark } from "@/utils/deliveryDisplayHelpers";
import type { Delivery } from "../../types";

type DetailServiceInfoCardProps = {
  delivery: Delivery;
};

function IconService({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export default function DetailServiceInfoCard({
  delivery,
}: DetailServiceInfoCardProps) {
  const serviceName = delivery.selectedService ?? "Delivery partner";
  const partner = getPartnerMark(serviceName);
  const tagline = delivery.serviceTagline ?? "Fast & reliable delivery";
  const serviceType = delivery.serviceType ?? "Standard";

  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-muted-foreground">
          <IconService />
        </span>
        <h3 className="text-body font-bold text-foreground">Service information</h3>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-caption font-bold ${partner.className}`}
          aria-hidden="true"
        >
          {partner.letter}
        </span>
        <div className="min-w-0">
          <p className="text-body font-semibold text-foreground">{serviceName}</p>
          <p className="mt-0.5 text-small capitalize text-muted-foreground">
            {tagline}
          </p>
          <span className="mt-2 inline-flex rounded-pill border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-caption font-semibold capitalize text-blue-700">
            {serviceType.replace(" delivery", "")}
          </span>
        </div>
      </div>
    </section>
  );
}
