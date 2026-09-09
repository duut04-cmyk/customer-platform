import DeliveryDetail from "@/deliveries/detail";

type PageProps = {
  params: Promise<{ deliveryId: string }>;
};

export default async function DeliveryDetailPage({ params }: PageProps) {
  const { deliveryId } = await params;
  return <DeliveryDetail deliveryId={deliveryId} />;
}
