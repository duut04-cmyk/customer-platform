import PricingBreakdown from "@/create-delivery/components/PricingBreakdown";
import type { Delivery } from "../../types";

type DeliveryPricingSummaryProps = {
  delivery: Delivery;
};

export default function DeliveryPricingSummary({
  delivery,
}: DeliveryPricingSummaryProps) {
  if (!delivery.pricing) {
    return null;
  }

  return (
    <PricingBreakdown pricing={delivery.pricing} heading="Pricing" showNote={false} />
  );
}
