import { IconSparkleDecorative, IconTruck } from "./icons";

export default function DeliveryNetworkCard() {
  return (
    <section className="min-w-0 w-full max-w-full rounded-xl bg-[#fff9f5] p-3.5 sm:p-4 lg:landscape:p-5 xl:p-5">
      <IconSparkleDecorative className="h-8 w-12 text-accent" />

      <h3 className="mt-3 text-body font-bold text-foreground lg:landscape:mt-3">
        Your delivery network
      </h3>
      <p className="mt-2 text-small leading-relaxed text-muted-foreground lg:landscape:mt-2">
        Doot compares eligible delivery services to get you the best option — on time,
        with the right price.
      </p>

      <div className="mt-5 flex items-center gap-2 sm:mt-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white shadow-sm">
          <IconTruck className="h-5 w-5 text-emerald-600" />
        </span>
        <p className="text-caption text-muted-foreground">
          Provider selected automatically for your route
        </p>
      </div>
    </section>
  );
}
