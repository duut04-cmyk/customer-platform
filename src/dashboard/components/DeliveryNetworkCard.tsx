import type { ComponentType } from "react";
import { DELIVERY_PARTNERS } from "@/utils/deliveryDisplayHelpers";
import {
  IconChevronRight,
  IconPartnerCityFleet,
  IconPartnerFlashDrop,
  IconPartnerMoveX,
  IconPartnerSwiftGo,
  IconSparkleDecorative,
} from "./icons";

const PARTNER_LOGOS: Record<
  (typeof DELIVERY_PARTNERS)[number],
  { icon: ComponentType<{ className?: string }>; iconClassName: string }
> = {
  FlashDrop: { icon: IconPartnerFlashDrop, iconClassName: "text-blue-600" },
  MoveX: { icon: IconPartnerMoveX, iconClassName: "text-emerald-600" },
  CityFleet: { icon: IconPartnerCityFleet, iconClassName: "text-blue-700" },
  SwiftGo: { icon: IconPartnerSwiftGo, iconClassName: "text-orange-500" },
};

export default function DeliveryNetworkCard() {
  return (
    <section className="rounded-xl bg-[#fff9f5] p-5">
      <IconSparkleDecorative className="h-8 w-12 text-accent" />

      <h3 className="mt-3 text-body font-bold text-foreground">
        Your delivery network
      </h3>
      <p className="mt-2 text-small leading-relaxed text-muted-foreground">
        Doot compares multiple delivery services to get you the best option — on time,
        with the right price.
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {DELIVERY_PARTNERS.map((partner) => {
            const { icon: LogoIcon, iconClassName } = PARTNER_LOGOS[partner];

            return (
              <span
                key={partner}
                title={partner}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-white shadow-sm"
              >
                <LogoIcon className={`h-5 w-5 ${iconClassName}`} />
              </span>
            );
          })}
        </div>

        <button
          type="button"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-white text-foreground shadow-sm transition-colors hover:bg-surface"
          aria-label="View more partners"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
