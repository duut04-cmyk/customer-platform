import Link from "next/link";
import DashboardHeader from "@/dashboard/components/DashboardHeader";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import BackButton from "@/dashboard/components/BackButton";
import { getDeliveryById } from "../mockDeliveries";
import TrackingDetails from "./components/TrackingDetails";
import TrackingHeader from "./components/TrackingHeader";
import TrackingMap from "./components/TrackingMap";
import TrackingStatus from "./components/TrackingStatus";

type DeliveryTrackingProps = {
  deliveryId: string;
};

export default function DeliveryTracking({ deliveryId }: DeliveryTrackingProps) {
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
          <Link
            href="/dashboard/deliveries"
            className="mt-6 inline-block text-body font-semibold text-accent"
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
        <TrackingHeader delivery={delivery} />
        <TrackingMap />
        <TrackingStatus delivery={delivery} />
        <TrackingDetails delivery={delivery} />
      </main>
    </div>
  );
}
