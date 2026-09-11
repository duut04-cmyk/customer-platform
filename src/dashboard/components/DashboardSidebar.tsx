"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/common/components/Logo";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { DELIVERIES_PATH } from "@/deliveries/paths";
import { HELP_SUPPORT_PATH } from "@/help/paths";
import { IconClose, IconHome, IconPackage, IconPlusCircle } from "./icons";
import { DASHBOARD_SIDEBAR_WIDTH } from "./layout";

type DashboardSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

const navItems = [
  {
    label: "Dashboard",
    href: DASHBOARD_PATH,
    icon: IconHome,
    match: (path: string) => path === DASHBOARD_PATH,
  },
  {
    label: "Deliveries",
    href: DELIVERIES_PATH,
    icon: IconPackage,
    match: (path: string) => path === DELIVERIES_PATH || /^\/deliveries\//.test(path),
  },
  {
    label: "Create delivery",
    href: CREATE_DELIVERY_PATH,
    icon: IconPlusCircle,
    match: (path: string) => path.startsWith(CREATE_DELIVERY_PATH),
  },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3" aria-label="Dashboard">
      {navItems.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-[4px] px-3 py-2 text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              active
                ? "bg-surface-accent text-accent"
                : "text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-border px-4 py-4">
      <p className="text-caption font-semibold text-foreground">Need help?</p>
      <Link
        href={HELP_SUPPORT_PATH}
        className="mt-0.5 inline-block text-caption font-medium text-accent hover:text-accent/80"
      >
        Contact support
      </Link>
    </div>
  );
}

export default function DashboardSidebar({
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-20 hidden ${DASHBOARD_SIDEBAR_WIDTH} flex-col border-r border-border bg-background lg:flex`}
      >
        <div className="flex h-14 shrink-0 items-center px-5 lg:h-16 lg:px-6">
          <Link
            href={DASHBOARD_PATH}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Logo className="text-[2.25rem] leading-none" />
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-3">
          <SidebarNav />
          <div className="mt-auto">
            <SidebarFooter />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close navigation menu"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex ${DASHBOARD_SIDEBAR_WIDTH} flex-col border-r border-border bg-background transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          <Link href={DASHBOARD_PATH} onClick={onMobileClose}>
            <Logo className="text-[2.25rem] leading-none" />
          </Link>
          <button
            type="button"
            className="rounded-[4px] p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Close menu"
            onClick={onMobileClose}
          >
            <IconClose />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-3">
          <SidebarNav onNavigate={onMobileClose} />
          <div className="mt-auto">
            <SidebarFooter />
          </div>
        </div>
      </aside>
    </>
  );
}
