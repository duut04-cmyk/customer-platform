import Link from "next/link";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import BackButton from "@/dashboard/components/BackButton";
import { getDeliveryById } from "../mockDeliveries";
import DriverInfo from "./components/DriverInfo";
import OtpVerificationCard from "./components/OtpVerificationCard";
import TrackingDeliveryDetails from "./components/TrackingDeliveryDetails";
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
      <main className={`${DASHBOARD_MAIN} text-center`}>
        <BackButton href="/deliveries" label="Back to deliveries" />
        <h1 className="mt-6 text-heading font-bold text-foreground">
          Delivery not found
        </h1>
        <Link
          href="/deliveries"
          className="mt-6 inline-block text-body font-semibold text-accent"
        >
          Go to delivery history
        </Link>
      </main>
    );
  }

  return (
    <main className={`${DASHBOARD_MAIN} space-y-6 lg:space-y-8`}>
      <TrackingHeader delivery={delivery} />
      <TrackingStatus delivery={delivery} />
      <OtpVerificationCard delivery={delivery} />
      <DriverInfo delivery={delivery} />
      <TrackingMap />
      <TrackingDetails delivery={delivery} />
      <TrackingDeliveryDetails delivery={delivery} />
    </main>
  );
}
