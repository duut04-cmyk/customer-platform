import type { ComponentType } from "react";
import { DELIVERY_PARTNERS } from "@/utils/deliveryDisplayHelpers";
import {
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
    <section className="min-w-0 w-full max-w-full rounded-xl bg-[#fff9f5] p-3.5 sm:p-4 lg:landscape:p-5 xl:p-5">
      <IconSparkleDecorative className="h-8 w-12 text-accent" />

      <h3 className="mt-3 text-body font-bold text-foreground lg:landscape:mt-3">
        Your delivery network
      </h3>
      <p className="mt-2 text-small leading-relaxed text-muted-foreground lg:landscape:mt-2">
        Doot compares multiple delivery services to get you the best option — on time,
        with the right price.
      </p>

      <div className="mt-5 grid max-w-[11rem] grid-cols-4 gap-2 sm:mt-6 sm:max-w-none sm:gap-2.5 md:portrait:max-w-[11rem] lg:landscape:mt-6 lg:landscape:max-w-none xl:max-w-none">
        {DELIVERY_PARTNERS.map((partner) => {
          const { icon: LogoIcon, iconClassName } = PARTNER_LOGOS[partner];

          return (
            <span
              key={partner}
              title={partner}
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white shadow-sm sm:h-10 sm:w-10"
            >
              <LogoIcon
                className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${iconClassName}`}
              />
            </span>
          );
        })}
      </div>
    </section>
  );
}
