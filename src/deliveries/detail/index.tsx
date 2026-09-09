import Link from "next/link";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import BackButton from "@/dashboard/components/BackButton";
import DriverInfo from "../tracking/components/DriverInfo";
import OtpVerificationCard from "../tracking/components/OtpVerificationCard";
import { getDeliveryById } from "../mockDeliveries";
import DeliveryActions from "./components/DeliveryActions";
import DeliveryDetailHeader from "./components/DeliveryHeader";
import DeliveryPackage from "./components/DeliveryPackage";
import DeliveryPricingSummary from "./components/DeliveryPricingSummary";
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

  return (
    <main className={`${DASHBOARD_MAIN} space-y-6 lg:space-y-8`}>
      <DeliveryDetailHeader delivery={delivery} />
      <DeliveryStatus delivery={delivery} />
      <DeliveryRoute delivery={delivery} />
      <OtpVerificationCard delivery={delivery} />
      <DriverInfo delivery={delivery} />
      <DeliveryPackage delivery={delivery} />
      <DeliveryPricingSummary delivery={delivery} />
      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <h2 className="mb-5 text-body-lg font-bold text-foreground">Timeline</h2>
        <DeliveryTimeline events={delivery.timeline} />
      </section>
      <DeliveryActions delivery={delivery} />
    </main>
  );
}
