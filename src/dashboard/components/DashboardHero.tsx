"use client";

import { useRouter } from "next/navigation";
import Button from "@/common/components/Button";

export const CREATE_DELIVERY_PATH = "/dashboard/deliveries/create";

export default function DashboardHero() {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <h1 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
        Good morning, John
      </h1>
      <p className="text-body-lg text-muted-foreground">
        What would you like to send today?
      </p>
      <div className="pt-4">
        <Button
          className="h-11 gap-2 px-6 text-body font-semibold"
          onClick={() => router.push(CREATE_DELIVERY_PATH)}
        >
          <span aria-hidden="true">+</span>
          Create a delivery
        </Button>
      </div>
    </div>
  );
}
