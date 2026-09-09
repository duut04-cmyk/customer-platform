import Link from "next/link";
import Button from "@/common/components/Button";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { IconChevronRight } from "@/dashboard/components/icons";

export default function DeliveriesHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Delivery history
        </h1>
        <p className="text-body text-muted-foreground">
          View, track and manage all your deliveries in one place.
        </p>
      </div>
      <Link href={CREATE_DELIVERY_PATH} className="shrink-0">
        <Button className="h-10 gap-2 rounded-[10px] px-5 text-small font-semibold sm:w-auto">
          <span aria-hidden="true">+</span>
          Create a delivery
          <IconChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
