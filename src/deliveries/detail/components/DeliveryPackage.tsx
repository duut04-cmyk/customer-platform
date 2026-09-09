import type { Delivery } from "../../types";

type DeliveryPackageProps = {
  delivery: Delivery;
};

export default function DeliveryPackage({ delivery }: DeliveryPackageProps) {
  const sizeLine =
    delivery.dimensions === "Not provided" && delivery.weight === "Not provided"
      ? "Size and weight not provided"
      : `${delivery.dimensions} · ${delivery.weight}`;

  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        Package
      </p>
      <p className="mt-2 text-body font-semibold text-foreground">
        {delivery.packageType}
      </p>
      <p className="mt-1 text-small text-muted-foreground">{sizeLine}</p>

      {delivery.packagePhotoUrl && (
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={delivery.packagePhotoUrl}
            alt={`${delivery.packageType} package`}
            className="max-h-48 w-full object-cover"
          />
        </div>
      )}

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
