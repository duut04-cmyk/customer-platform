import Link from "next/link";
import Button from "@/common/components/Button";
import { CREATE_DELIVERY_PATH } from "@/dashboard/components/DashboardHero";
import type { Delivery } from "../types";
import DeliveryHistoryCard from "./DeliveryHistoryCard";

type DeliveryListProps = {
  deliveries: Delivery[];
};

export default function DeliveryList({ deliveries }: DeliveryListProps) {
  if (deliveries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background py-12 text-center shadow-sm">
        <p className="text-body font-medium text-foreground">
          No deliveries yet.
        </p>
        <p className="mt-2 text-small text-muted-foreground">
          Once you create a delivery, your delivery history will appear here.
        </p>
        <Link href={CREATE_DELIVERY_PATH} className="mt-5 inline-block">
          <Button variant="secondary" className="h-11 px-6 text-body font-semibold">
            Create a delivery
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {deliveries.map((delivery) => (
        <li key={delivery.id}>
          <DeliveryHistoryCard delivery={delivery} />
        </li>
      ))}
    </ul>
  );
}
