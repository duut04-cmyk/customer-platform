"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "@/common/components/Button";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { IconCheck, IconChevronDown, IconTruck } from "@/dashboard/components/icons";
import { deliveryRoutePath } from "@/deliveries/paths";
import type { Delivery } from "../../types";

type CompletedDeliveryOverviewCardProps = {
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

function getPackagePhotos(delivery: Delivery): string[] {
  if (delivery.packagePhotoUrls?.length) return delivery.packagePhotoUrls;
  if (delivery.packagePhotoUrl) return [delivery.packagePhotoUrl];
  return [];
}

export default function CompletedDeliveryOverviewCard({
  delivery,
}: CompletedDeliveryOverviewCardProps) {
  const [summaryOpen, setSummaryOpen] = useState(true);
  const driver = delivery.driver;
  const photos = getPackagePhotos(delivery);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="space-y-5 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-caption font-medium text-muted-foreground">
              Delivery ID
            </p>
            <h2 className="mt-0.5 text-body-lg font-bold text-foreground md:text-subheading">
              {delivery.id}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-caption font-semibold text-emerald-700">
            <IconCheck className="h-3.5 w-3.5" />
            Delivered
          </span>
        </div>

        <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-3">
          <div>
            <p className="text-caption font-medium text-muted-foreground">Time</p>
            <p className="mt-1 text-small font-semibold text-foreground">
              {delivery.deliveredAtLabel ??
                `Delivered at ${delivery.estimatedArrival}, ${delivery.dateLabel}`}
            </p>
          </div>

          {driver && (
            <div>
              <p className="text-caption font-medium text-muted-foreground">Driver</p>
              <div className="mt-2 flex items-center gap-2">
                {driver.photoUrl ? (
                  <Image
                    src={driver.photoUrl}
                    alt={driver.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-caption font-bold">
                    {driver.initials}
                  </span>
                )}
                <div>
                  <p className="text-small font-semibold text-foreground">
                    {driver.name}
                  </p>
                  {driver.phone && (
                    <a
                      href={`tel:${driver.phone.replace(/\s/g, "")}`}
                      className="mt-1 inline-flex items-center gap-1 text-caption font-semibold text-blue-600"
                    >
                      <IconPhone className="h-3.5 w-3.5" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {driver && (
            <div>
              <p className="text-caption font-medium text-muted-foreground">Vehicle</p>
              <div className="mt-2 flex items-center gap-2">
                <IconTruck className="h-4 w-4 text-muted-foreground" />
                <p className="text-small font-semibold text-foreground">
                  {driver.vehicleType} · {driver.vehicleNumber}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setSummaryOpen((open) => !open)}
            className="flex w-full cursor-pointer items-center justify-between gap-2 text-left"
          >
            <span className="text-body font-bold text-foreground">
              Delivery summary
            </span>
            <IconChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${summaryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {summaryOpen && (
            <div className="mt-4 space-y-3 text-small">
              <div>
                <p className="text-caption text-muted-foreground">Pickup location</p>
                <p className="font-medium text-foreground">{delivery.pickup.address}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Drop-off location</p>
                <p className="font-medium text-foreground">
                  {delivery.dropoff.address}
                </p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Package details</p>
                <p className="font-medium text-foreground">
                  {delivery.packageType} · {delivery.weight}
                </p>
                {photos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {photos.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="h-14 w-14 overflow-hidden rounded-lg border border-border"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Package ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={deliveryRoutePath(delivery.id)} className="flex-1">
            <Button
              type="button"
              className="h-11 w-full gap-2 rounded-[6px] px-6 text-body font-semibold"
            >
              View delivery details →
            </Button>
          </Link>
          <Link href={CREATE_DELIVERY_PATH} className="flex-1">
            <Button
              type="button"
              variant="secondary"
              className="h-11 w-full rounded-[6px] px-6 text-body font-semibold"
            >
              Book again
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
