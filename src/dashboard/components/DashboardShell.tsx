"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { PRIVATE_IN_PAGE_HEADER_PATHS } from "@/utils/appPaths";
import { DashboardShellContext } from "./DashboardShellContext";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopHeader from "./DashboardTopHeader";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const usesInPageHeader = PRIVATE_IN_PAGE_HEADER_PATHS.includes(
    pathname as (typeof PRIVATE_IN_PAGE_HEADER_PATHS)[number],
  );

  const shellContext = useMemo(
    () => ({ openMobileNav: () => setMobileNavOpen(true) }),
    [],
  );

  return (
    <DashboardShellContext.Provider value={shellContext}>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col bg-white lg:ml-60">
          {!usesInPageHeader && (
            <DashboardTopHeader onMenuClick={() => setMobileNavOpen(true)} />
          )}
          <div className="min-h-0 flex-1 overflow-y-auto bg-white">{children}</div>
        </div>
      </div>
    </DashboardShellContext.Provider>
  );
}
