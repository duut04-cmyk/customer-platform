"use client";

import Image from "next/image";
import { IconTruck } from "@/dashboard/components/icons";
import type { Delivery } from "../../types";

type DetailDriverCardProps = {
  delivery: Delivery;
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

function IconIdCard({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2" />
      <path d="M14 10h4M14 14h4" strokeLinecap="round" />
    </svg>
  );
}

export default function DetailDriverCard({ delivery }: DetailDriverCardProps) {
  if (delivery.status === "cancelled" || delivery.status === "failed") {
    return null;
  }

  if (!delivery.driver) {
    return (
      <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            <IconIdCard />
          </span>
          <div>
            <h3 className="text-body font-bold text-foreground">Driver details</h3>
            <p className="mt-2 text-small text-muted-foreground">
              Finding your delivery partner…
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { driver } = delivery;

  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <IconIdCard />
        </span>
        <h3 className="text-body font-bold text-foreground">Driver details</h3>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {driver.photoUrl ? (
            <Image
              src={driver.photoUrl}
              alt={driver.name}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface text-body-lg font-bold text-foreground">
              {driver.initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-body-lg font-semibold text-foreground">{driver.name}</p>
            <p className="mt-0.5 text-small text-muted-foreground">
              <span aria-hidden="true">★ </span>
              <span className="font-medium text-foreground">
                {driver.rating.toFixed(1)}
              </span>
              {driver.deliveryCount != null && (
                <span> ({driver.deliveryCount} deliveries)</span>
              )}
            </p>
            {driver.phone && (
              <button
                type="button"
                onClick={() => {
                  window.location.href = `tel:${driver.phone?.replace(/\s/g, "")}`;
                }}
                className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-caption font-semibold text-blue-600 hover:text-blue-700"
              >
                <IconPhone />
                Call
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-small text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <IconTruck className="h-4 w-4 text-foreground/70" />
            {driver.vehicleType}
          </span>
          <span className="font-medium text-foreground">{driver.vehicleNumber}</span>
        </div>
      </div>
    </section>
  );
}
