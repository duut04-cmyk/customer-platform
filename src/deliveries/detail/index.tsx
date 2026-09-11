import Link from "next/link";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import BackButton from "@/dashboard/components/BackButton";
import { getDeliveryById } from "../mockDeliveries";
import { buildCustomerDetailTimeline, isActiveDeliveryDetailStatus } from "../types";
import DeliveryDetailHeader from "./components/DeliveryHeader";
import DeliveryLocationsCard from "./components/DeliveryLocationsCard";
import DeliverySummaryHeroCard from "./components/DeliverySummaryHeroCard";
import DeliveryTimeline from "./components/DeliveryTimeline";
import DetailDriverCard from "./components/DetailDriverCard";
import DetailNeedHelpCard from "./components/DetailNeedHelpCard";
import DetailSafeCompliantCard from "./components/DetailSafeCompliantCard";
import DetailServiceInfoCard from "./components/DetailServiceInfoCard";

type DeliveryDetailProps = {
  deliveryId: string;
};

export default function DeliveryDetail({ deliveryId }: DeliveryDetailProps) {
  const delivery = getDeliveryById(deliveryId);

  if (!delivery) {
    return (
      <main className={`${DASHBOARD_MAIN} text-center`}>
        <BackButton href="/deliveries" label="Back to deliveries" />
        <h1 className="mt-6 text-heading font-bold text-foreground">
          Delivery not found
        </h1>
        <p className="mt-2 text-body text-muted-foreground">
          We couldn&apos;t find delivery {deliveryId}.
        </p>
        <Link
          href="/deliveries"
          className="mt-6 inline-block text-body font-semibold text-accent hover:text-accent/80"
        >
          Go to delivery history
        </Link>
      </main>
    );
  }

  const timelineEvents = buildCustomerDetailTimeline(delivery);
  const isActive = isActiveDeliveryDetailStatus(delivery.status);

  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-6 lg:space-y-8">
        <DeliveryDetailHeader delivery={delivery} />
        <DeliverySummaryHeroCard delivery={delivery} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-4">
            {isActive && <DeliveryTimeline events={timelineEvents} />}
            <DeliveryLocationsCard delivery={delivery} />
          </div>

          <aside className="flex flex-col gap-4">
            <DetailDriverCard delivery={delivery} />
            <DetailServiceInfoCard delivery={delivery} />
            {isActive ? <DetailSafeCompliantCard /> : <DetailNeedHelpCard />}
          </aside>
        </div>
      </div>
    </main>
  );
}
