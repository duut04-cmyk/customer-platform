"use client";

type DeliveryRouteMapProps = {
  pickupAddress: string;
  dropAddress: string;
  className?: string;
};

function buildMapEmbedUrl(pickupAddress: string, dropAddress: string): string | null {
  const pickup = pickupAddress.trim();
  const drop = dropAddress.trim();
  if (!pickup || !drop) return null;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    const params = new URLSearchParams({
      key: apiKey,
      origin: pickup,
      destination: drop,
      mode: "driving",
    });
    return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
  }

  const params = new URLSearchParams({
    f: "d",
    saddr: pickup,
    daddr: drop,
    hl: "en",
    output: "embed",
  });
  return `https://maps.google.com/maps?${params.toString()}`;
}

export default function DeliveryRouteMap({
  pickupAddress,
  dropAddress,
  className = "",
}: DeliveryRouteMapProps) {
  const embedUrl = buildMapEmbedUrl(pickupAddress, dropAddress);

  if (!embedUrl) {
    return (
      <div
        className={`flex h-[min(55vh,480px)] items-center justify-center rounded-lg border border-border bg-surface/60 sm:h-[360px] md:h-[420px] lg:h-[480px] ${className}`}
      >
        <p className="px-4 text-center text-small text-muted-foreground">
          Add pickup and drop-off addresses to preview the route.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-border bg-surface/60 ${className}`}
    >
      <iframe
        title="Delivery route map"
        src={embedUrl}
        className="h-[min(55vh,480px)] w-full border-0 sm:h-[360px] md:h-[420px] lg:h-[480px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
