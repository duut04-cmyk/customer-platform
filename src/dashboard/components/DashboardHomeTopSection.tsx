"use client";

import Link from "next/link";
import { Suspense } from "react";
import Button from "@/common/components/Button";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import DashboardSearch from "./DashboardSearch";
import { useDashboardShell } from "./DashboardShellContext";
import { IconChevronRight, IconMenu, IconWave } from "./icons";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

const createButtonClassName = "h-10 gap-2 rounded-[10px] px-5 text-small font-semibold";

function CreateDeliveryButton({
  className = createButtonClassName,
}: {
  className?: string;
}) {
  return (
    <Link href={CREATE_DELIVERY_PATH}>
      <Button className={className}>
        <span aria-hidden="true">+</span>
        Create a delivery
        <IconChevronRight className="h-4 w-4" />
      </Button>
    </Link>
  );
}

function GreetingBlock() {
  return (
    <div className="space-y-1">
      <h1 className="flex items-center gap-1.5 text-heading font-bold tracking-tight text-foreground">
        Good morning, John
        <IconWave className="h-6 w-6" />
      </h1>
      <p className="text-body text-muted-foreground">
        Here&apos;s what&apos;s happening with your deliveries today.
      </p>
    </div>
  );
}

export default function DashboardHomeTopSection() {
  const { openMobileNav } = useDashboardShell();

  return (
    <div className="bg-white">
      {/* Desktop: greeting + actions on top row, search below greeting */}
      <div className="hidden space-y-4 lg:block">
        <div className="flex items-start justify-between gap-4">
          <GreetingBlock />
          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell />
            <UserMenu />
            <CreateDeliveryButton />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="h-10 w-full max-w-xl rounded-[4px] border border-border bg-white" />
          }
        >
          <DashboardSearch variant="wide" className="max-w-xl" />
        </Suspense>
      </div>

      {/* Mobile */}
      <div className="space-y-3 bg-white lg:hidden">
        <GreetingBlock />

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-[4px] p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Open navigation menu"
            onClick={openMobileNav}
          >
            <IconMenu />
          </button>

          <Suspense
            fallback={
              <div className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-white" />
            }
          >
            <DashboardSearch variant="flex" />
          </Suspense>

          <NotificationBell />
          <UserMenu compact />
        </div>

        <div className="flex justify-end">
          <CreateDeliveryButton className="h-9 gap-1.5 rounded-[10px] px-4 text-small font-semibold" />
        </div>
      </div>
    </div>
  );
}
