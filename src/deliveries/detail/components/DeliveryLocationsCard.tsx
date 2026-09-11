import { IconMapPinFilled, IconPackageFilled } from "@/dashboard/components/icons";
import type { Delivery } from "../../types";

type DeliveryLocationsCardProps = {
  delivery: Delivery;
};

function IconNotebook({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M4 4h12a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2-3-2V6a2 2 0 0 1 2-2Z"
        strokeLinejoin="round"
      />
      <path d="M8 8h6M8 12h6" strokeLinecap="round" />
    </svg>
  );
}

function getPackagePhotos(delivery: Delivery): string[] {
  if (delivery.packagePhotoUrls && delivery.packagePhotoUrls.length > 0) {
    return delivery.packagePhotoUrls;
  }
  if (delivery.packagePhotoUrl) {
    return [delivery.packagePhotoUrl];
  }
  return [];
}

export default function DeliveryLocationsCard({
  delivery,
}: DeliveryLocationsCardProps) {
  const packagePhotos = getPackagePhotos(delivery);
  const instructions =
    delivery.specialInstructions ??
    (delivery.requirements.length > 0 ? delivery.requirements.join(". ") : "None");

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="space-y-5 p-5 md:p-6">
        <h2 className="text-body-lg font-bold text-foreground">
          Pickup &amp; drop locations
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <IconMapPinFilled className="h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-caption font-medium text-muted-foreground">
                Pickup location
              </p>
            </div>
            <p className="mt-2 text-small font-medium text-foreground">
              {delivery.pickup.address}
            </p>
          </div>
          <div className="min-w-0 sm:border-l sm:border-border sm:pl-4">
            <div className="flex items-center gap-2">
              <IconMapPinFilled className="h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-caption font-medium text-muted-foreground">
                Drop-off location
              </p>
            </div>
            <p className="mt-2 text-small font-medium text-foreground">
              {delivery.dropoff.address}
            </p>
          </div>
        </div>

        <div className="space-y-0 divide-y divide-border border-t border-border">
          <div className="flex items-start gap-3 py-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff7ed] text-accent">
              <IconPackageFilled className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-medium text-muted-foreground">
                Package details
              </p>
              <p className="mt-0.5 text-small font-medium text-foreground">
                {delivery.packageType} · {delivery.weight} · {delivery.dimensions}
              </p>
              {packagePhotos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {packagePhotos.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="h-16 w-16 overflow-hidden rounded-lg border border-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Package photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 py-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <IconNotebook />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-medium text-muted-foreground">
                Special instructions
              </p>
              <p className="mt-0.5 text-small leading-relaxed text-foreground">
                {instructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
