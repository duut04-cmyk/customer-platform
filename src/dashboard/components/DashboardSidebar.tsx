"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/common/components/Logo";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { DELIVERIES_PATH } from "@/deliveries/paths";
import { HELP_SUPPORT_APP_PATH } from "@/help/paths";
import { SAFETY_COMPLIANCE_APP_PATH } from "@/safety/paths";
import { IconHome, IconPackage, IconPlusCircle, IconShield } from "./icons";
import { DASHBOARD_SIDEBAR_WIDTH } from "./layout";

type DashboardSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

type SidebarVariant = "desktop" | "mobile";

const SIDEBAR_BG = "bg-[#0B1F3A]";
const SIDEBAR_BORDER = "border-white/10";

const primaryNavItems = [
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
] as const;

const secondaryNavItems = [
  {
    label: "Help & support",
    href: HELP_SUPPORT_APP_PATH,
    icon: IconHelpCircle,
    match: (path: string) =>
      path === HELP_SUPPORT_APP_PATH || path.startsWith(`${HELP_SUPPORT_APP_PATH}/`),
  },
  {
    label: "Safety & compliance",
    href: SAFETY_COMPLIANCE_APP_PATH,
    icon: IconShield,
    match: (path: string) =>
      path === SAFETY_COMPLIANCE_APP_PATH ||
      path.startsWith(`${SAFETY_COMPLIANCE_APP_PATH}/`),
  },
] as const;

function IconHelpCircle({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M9.5 9.5a2.5 2.5 0 1 1 3.8 2.1c-.7.4-1.3 1-1.3 1.9V14"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SidebarNavLink({
  href,
  label,
  icon: Icon,
  active,
  isMobile,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
  active: boolean;
  isMobile: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50 ${
        isMobile
          ? "min-h-11 gap-3 rounded-[6px] px-3 py-2.5 text-small"
          : "gap-2.5 rounded-[6px] px-3 py-2.5 text-small"
      } ${
        active
          ? "bg-[#2B6CB0] text-white shadow-sm"
          : "text-white/65 hover:bg-white/5 hover:text-white"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={`shrink-0 ${isMobile ? "h-5 w-5" : "h-[18px] w-[18px]"}`} />
      {label}
    </Link>
  );
}

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
      className={`flex flex-col ${isMobile ? "gap-5" : "flex-1 gap-6 px-3"}`}
      aria-label="Dashboard"
    >
      <div className="flex flex-col gap-1">
        <p className="mb-1 px-3 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white/35">
          Main
        </p>
        {primaryNavItems.map((item) => (
          <SidebarNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={item.match(pathname)}
            isMobile={isMobile}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <p className="mb-1 px-3 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white/35">
          Support
        </p>
        {secondaryNavItems.map((item) => (
          <SidebarNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={item.match(pathname)}
            isMobile={isMobile}
            onNavigate={onNavigate}
          />
        ))}
      </div>
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
        isMobile ? "pb-[max(1.25rem,env(safe-area-inset-bottom))]" : "px-3 pb-4"
      }
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <p className="text-caption font-semibold text-white">Need help?</p>
        <p className="mt-1 text-caption leading-relaxed text-white/50">
          Questions about booking, tracking, or account access.
        </p>
        <Link
          href={HELP_SUPPORT_APP_PATH}
          onClick={onNavigate}
          className="mt-3 inline-flex items-center gap-1.5 text-caption font-semibold text-accent transition-colors hover:text-accent/85"
        >
          Contact support
          <span aria-hidden="true">→</span>
        </Link>
      </div>
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
        className={`fixed inset-y-0 left-0 z-20 hidden ${DASHBOARD_SIDEBAR_WIDTH} flex-col border-r ${SIDEBAR_BORDER} ${SIDEBAR_BG} xl:flex`}
      >
        <div className="flex shrink-0 items-center px-5 pt-5 pb-6 lg:px-5 lg:pt-6 lg:pb-7">
          <Link
            href={DASHBOARD_PATH}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Logo onDark className="text-[1.75rem] leading-none lg:text-[1.85rem]" />
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-3">
          <SidebarNav />
          <div className="mt-auto pt-6">
            <SidebarFooter />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          aria-label="Close navigation menu"
          onClick={onMobileClose}
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(100%,20rem)] flex-col border-r ${SIDEBAR_BORDER} ${SIDEBAR_BG} shadow-xl transition-transform duration-200 xl:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`flex min-h-16 shrink-0 items-center border-b ${SIDEBAR_BORDER} px-5 py-4 pt-[max(16px,env(safe-area-inset-top))]`}
        >
          <Link
            href={DASHBOARD_PATH}
            onClick={onMobileClose}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Logo onDark className="text-2xl leading-none" />
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-3 pt-4">
          <SidebarNav variant="mobile" onNavigate={onMobileClose} />
          <div className="mt-auto shrink-0 pt-6">
            <SidebarFooter variant="mobile" onNavigate={onMobileClose} />
          </div>
        </div>
      </aside>
    </>
  );
}
