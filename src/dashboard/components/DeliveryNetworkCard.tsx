import { IconSparkleDecorative, IconTruck } from "./icons";

export default function DeliveryNetworkCard() {
  return (
    <section className="min-w-0 w-full max-w-full overflow-hidden rounded-[10px] border border-accent/15 bg-[#FFF8F1] p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.12)] sm:p-5">
      <IconSparkleDecorative className="h-8 w-12 text-accent" />

      <h3 className="mt-3 text-body font-bold text-foreground">
        Your delivery network
      </h3>
      <p className="mt-2 text-small leading-relaxed text-muted-foreground">
        Doot compares eligible delivery services to get you the best option — on time,
        with the right price.
      </p>

      <div className="mt-5 flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-border/60 bg-white shadow-sm">
          <IconTruck className="h-5 w-5 text-emerald-600" />
        </span>
        <p className="text-caption leading-snug text-muted-foreground">
          Provider selected automatically for your route
        </p>
      </div>
    </section>
  );
}
