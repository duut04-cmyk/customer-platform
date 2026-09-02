import Link from "next/link";
import DashboardHeader from "@/dashboard/components/DashboardHeader";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import BackButton from "@/dashboard/components/BackButton";
import { getDeliveryById } from "../mockDeliveries";
import DeliveryActions from "./components/DeliveryActions";
import DeliveryDetailHeader from "./components/DeliveryHeader";
import DeliveryPackage from "./components/DeliveryPackage";
import DeliveryRoute from "./components/DeliveryRoute";
import DeliveryStatus from "./components/DeliveryStatus";
import DeliveryTimeline from "./components/DeliveryTimeline";

type DeliveryDetailProps = {
  deliveryId: string;
};

export default function DeliveryDetail({ deliveryId }: DeliveryDetailProps) {
  const delivery = getDeliveryById(deliveryId);

  if (!delivery) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader activeNav="deliveries" />
        <main className={`${DASHBOARD_MAIN} text-center`}>
          <BackButton href="/dashboard/deliveries" label="Back to deliveries" />
          <h1 className="mt-6 text-heading font-bold text-foreground">
            Delivery not found
          </h1>
          <p className="mt-2 text-body text-muted-foreground">
            We couldn&apos;t find delivery {deliveryId}.
          </p>
          <Link
            href="/dashboard/deliveries"
            className="mt-6 inline-block text-body font-semibold text-accent hover:text-accent/80"
          >
            Go to delivery history
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeNav="deliveries" />
      <main className={`${DASHBOARD_MAIN} space-y-6 lg:space-y-8`}>
        <DeliveryDetailHeader delivery={delivery} />
        <DeliveryStatus delivery={delivery} />

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <h2 className="mb-5 text-body-lg font-bold text-foreground">
              Timeline
            </h2>
            <DeliveryTimeline events={delivery.timeline} />
          </section>
          <DeliveryRoute delivery={delivery} />
        </div>

        <DeliveryPackage delivery={delivery} />
        <DeliveryActions delivery={delivery} />
      </main>
    </div>
  );
}
