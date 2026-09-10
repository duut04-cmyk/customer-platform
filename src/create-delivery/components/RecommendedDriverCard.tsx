"use client";

import Image from "next/image";
import Button from "@/common/components/Button";
import { IconTruck } from "@/dashboard/components/icons";
import type { RecommendedDriver } from "../types";

type RecommendedDriverCardProps = {
  driver: RecommendedDriver;
};

function IconPhone({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RecommendedDriverCard({ driver }: RecommendedDriverCardProps) {
  return (
    <section
      className="rounded-xl border border-border bg-background p-4 shadow-sm md:p-5"
      aria-labelledby="recommended-driver-heading"
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          id="recommended-driver-heading"
          className="text-body font-semibold text-foreground"
        >
          Driver details
        </h3>
        <Button
          type="button"
          variant="secondary"
          className="h-9 shrink-0 gap-1.5 rounded-[6px] px-3 text-small font-semibold"
          onClick={() => {
            window.location.href = `tel:${driver.phone.replace(/\s/g, "")}`;
          }}
        >
          <IconPhone />
          Call
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <Image
          src={driver.photoUrl}
          alt={driver.name}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="text-body-lg font-semibold text-foreground">{driver.name}</p>
            <p className="mt-0.5 text-small text-muted-foreground">
              <span aria-hidden="true">★ </span>
              <span className="font-medium text-foreground">
                {driver.rating.toFixed(1)}
              </span>
              <span> ({driver.deliveryCount} deliveries)</span>
            </p>
          </div>

          <div className="flex items-center gap-2 text-small text-muted-foreground">
            <IconTruck className="h-4 w-4 shrink-0 text-foreground/70" />
            <span className="font-medium text-foreground">{driver.vehicleNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{driver.vehicleType}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
