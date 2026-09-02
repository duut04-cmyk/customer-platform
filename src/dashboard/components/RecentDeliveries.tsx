"use client";

import { useRouter } from "next/navigation";
import Button from "@/common/components/Button";
import type { Delivery } from "@/dashboard/deliveries/types";
import DeliveryCard from "./DeliveryCard";
import { CREATE_DELIVERY_PATH } from "./DashboardHero";

type RecentDeliveriesProps = {
  deliveries?: Delivery[];
};

export default function RecentDeliveries({
  deliveries = [],
}: RecentDeliveriesProps) {
  const router = useRouter();
  const isEmpty = deliveries.length === 0;

  const goToCreate = () => router.push(CREATE_DELIVERY_PATH);

  return (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-body-lg font-bold text-foreground">
          Recent deliveries
        </h2>
        {!isEmpty && (
          <button
            type="button"
            onClick={() => router.push("/dashboard/deliveries")}
            className="cursor-pointer text-small font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View all deliveries →
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="mt-6 flex flex-col items-center py-6 text-center">
          <p className="text-body font-medium text-muted-foreground">
            You haven&apos;t created any deliveries yet.
          </p>
          <Button
            variant="secondary"
            className="mt-4 h-11 px-6 text-body font-semibold"
            onClick={goToCreate}
          >
            Create your first delivery
          </Button>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {deliveries.map((delivery) => (
            <li key={delivery.id}>
              <DeliveryCard delivery={delivery} showTrack />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
