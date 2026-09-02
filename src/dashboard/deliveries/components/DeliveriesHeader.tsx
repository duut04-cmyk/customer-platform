import Link from "next/link";
import Button from "@/common/components/Button";
import { CREATE_DELIVERY_PATH } from "@/dashboard/components/DashboardHero";

export default function DeliveriesHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <h1 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Delivery history
        </h1>
        <p className="text-body text-muted-foreground">
          View and track all your deliveries in one place.
        </p>
      </div>
      <Link href={CREATE_DELIVERY_PATH} className="shrink-0">
        <Button className="h-11 w-full px-6 text-body font-semibold sm:w-auto">
          Create a delivery
        </Button>
      </Link>
    </div>
  );
}
