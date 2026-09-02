import DeliveryTracking from "@/dashboard/deliveries/tracking";

type PageProps = {
  params: Promise<{ deliveryId: string }>;
};

export default async function DeliveryTrackingPage({ params }: PageProps) {
  const { deliveryId } = await params;
  return <DeliveryTracking deliveryId={deliveryId} />;
}
