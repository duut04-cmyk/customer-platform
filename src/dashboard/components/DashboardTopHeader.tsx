"use client";

import Link from "next/link";
import { Suspense } from "react";
import Button from "@/common/components/Button";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import DashboardSearch from "./DashboardSearch";
import { IconMenu, IconPlusCircle } from "./icons";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

type DashboardTopHeaderProps = {
  onMenuClick: () => void;
};

export default function DashboardTopHeader({ onMenuClick }: DashboardTopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-background">
      <div className="flex h-14 items-center gap-3 px-4 md:gap-4 md:px-6 lg:h-16 lg:px-8">
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground lg:hidden"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <IconMenu />
        </button>

        <Suspense
          fallback={
            <div className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-surface/50 lg:max-w-md" />
          }
        >
          <DashboardSearch variant="flex" className="lg:max-w-md" />
        </Suspense>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NotificationBell />
          <UserMenu />
          <Link href={CREATE_DELIVERY_PATH} className="hidden sm:inline-flex">
            <Button className="h-9 gap-1.5 px-4 text-small font-semibold lg:h-10">
              <IconPlusCircle className="h-4 w-4" />
              <span className="hidden md:inline">Create a delivery</span>
              <span className="md:hidden">Create</span>
            </Button>
          </Link>
          <Link
            href={CREATE_DELIVERY_PATH}
            className="inline-flex sm:hidden"
            aria-label="Create a delivery"
          >
            <Button className="h-9 w-9 p-0">
              <IconPlusCircle className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
