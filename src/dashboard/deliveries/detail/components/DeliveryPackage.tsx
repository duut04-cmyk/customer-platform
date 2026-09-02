import type { Delivery } from "../../types";

type DeliveryPackageProps = {
  delivery: Delivery;
};

export default function DeliveryPackage({ delivery }: DeliveryPackageProps) {
  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        Package
      </p>
      <p className="mt-2 text-body font-semibold text-foreground">
        {delivery.packageType}
      </p>
      <p className="mt-1 text-small text-muted-foreground">
        {delivery.dimensions} · {delivery.weight}
      </p>
      {delivery.requirements.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Requirements
          </p>
          <p className="mt-1 text-small text-foreground">
            {delivery.requirements.join(", ")}
          </p>
        </div>
      )}
    </section>
  );
}
