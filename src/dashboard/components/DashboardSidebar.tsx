"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/common/components/Logo";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { DELIVERIES_PATH } from "@/deliveries/paths";
import { HELP_SUPPORT_PATH } from "@/help/paths";
import { IconHome, IconPackage, IconPlusCircle } from "./icons";
import { DASHBOARD_SIDEBAR_WIDTH } from "./layout";

type DashboardSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

type SidebarVariant = "desktop" | "mobile";

const navItems = [
  {
    label: "Create delivery",
    href: CREATE_DELIVERY_PATH,
    icon: IconPlusCircle,
    match: (path: string) => path.startsWith(CREATE_DELIVERY_PATH),
  },
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
];

const inactiveNavClassName =
  "text-foreground/70 hover:bg-surface hover:text-foreground";

function SidebarNav({
  variant = "desktop",
  onNavigate,
}: {
  variant?: SidebarVariant;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isMobile = variant === "mobile";

  return (
    <nav
      className={`flex flex-col ${isMobile ? "gap-1" : "flex-1 gap-0.5 px-3"}`}
      aria-label="Dashboard"
    >
      {navItems.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              isMobile
                ? `min-h-10 gap-2.5 rounded-lg py-2 text-small ${
                    active ? "bg-surface-accent text-accent" : inactiveNavClassName
                  }`
                : `gap-2.5 rounded-[4px] px-3 py-2 text-small ${
                    active ? "bg-surface-accent text-accent" : inactiveNavClassName
                  }`
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={`shrink-0 ${isMobile ? "h-[21px] w-[21px]" : "h-[18px] w-[18px]"}`}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({
  variant = "desktop",
  onNavigate,
}: {
  variant?: SidebarVariant;
  onNavigate?: () => void;
}) {
  const isMobile = variant === "mobile";

  return (
    <div
      className={
        isMobile
          ? "border-t border-border/60 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          : "border-t border-border px-4 py-4"
      }
    >
      <p className="text-caption font-semibold text-foreground">Need help?</p>
      <Link
        href={HELP_SUPPORT_PATH}
        onClick={onNavigate}
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
        className={`fixed inset-y-0 left-0 z-20 hidden ${DASHBOARD_SIDEBAR_WIDTH} flex-col border-r border-border bg-background xl:flex`}
      >
        <div className="flex shrink-0 items-center px-5 pt-5 pb-6 lg:px-6 lg:pt-6 lg:pb-8">
          <Link
            href={DASHBOARD_PATH}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Logo className="text-[2.25rem] leading-none" />
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-3 pt-1">
          <SidebarNav />
          <div className="mt-auto">
            <SidebarFooter />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          aria-label="Close navigation menu"
          onClick={onMobileClose}
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[75%] flex-col border-r border-border bg-background shadow-xl transition-transform duration-200 md:w-1/3 xl:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex min-h-16 shrink-0 items-center border-b border-border/80 bg-background px-5 py-4 pt-[max(16px,env(safe-area-inset-top))]">
          <Link
            href={DASHBOARD_PATH}
            onClick={onMobileClose}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Logo className="text-2xl leading-none" />
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 pt-3">
          <SidebarNav variant="mobile" onNavigate={onMobileClose} />
          <div className="mt-auto shrink-0 pt-6">
            <SidebarFooter variant="mobile" onNavigate={onMobileClose} />
          </div>
        </div>
      </aside>
    </>
  );
}
