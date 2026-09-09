"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { DELIVERIES_PATH } from "@/deliveries/paths";
import { IconSearch } from "./icons";

type DashboardSearchProps = {
  className?: string;
  variant?: "wide" | "flex";
};

export default function DashboardSearch({
  className = "",
  variant = "flex",
}: DashboardSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState<string | null>(null);
  const value = draft ?? urlQuery;

  const applySearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      const isSearchablePage =
        pathname === DASHBOARD_PATH || pathname === DELIVERIES_PATH;

      if (isSearchablePage) {
        const params = new URLSearchParams(searchParams.toString());
        if (trimmed) {
          params.set("q", trimmed);
        } else {
          params.delete("q");
        }
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
        return;
      }

      router.push(
        trimmed ? `${DASHBOARD_PATH}?q=${encodeURIComponent(trimmed)}` : DASHBOARD_PATH,
      );
    },
    [pathname, router, searchParams],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDraft(null);
    applySearch(value);
  };

  const widthClass = variant === "wide" ? "w-full max-w-md" : "min-w-0 flex-1 w-full";

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${widthClass} ${className}`}
      role="search"
    >
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search by delivery ID, location, or service…"
        className="h-10 w-full rounded-[4px] border border-border bg-white pl-9 pr-3 text-small text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Search deliveries"
      />
    </form>
  );
}
