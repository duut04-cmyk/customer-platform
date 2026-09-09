"use client";

import { createContext, useContext } from "react";

type DashboardShellContextValue = {
  openMobileNav: () => void;
};

export const DashboardShellContext = createContext<DashboardShellContextValue>({
  openMobileNav: () => {},
});

export function useDashboardShell() {
  return useContext(DashboardShellContext);
}
