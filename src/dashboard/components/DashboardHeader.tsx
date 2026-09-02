"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/common/components/Logo";
import { DASHBOARD_SHELL } from "./layout";
import UserMenu from "./UserMenu";

type DashboardHeaderProps = {
  activeNav?: "dashboard" | "deliveries";
};

export default function DashboardHeader({
  activeNav,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const isDeliveriesSection =
    pathname === "/dashboard/deliveries" ||
    /^\/dashboard\/deliveries\/(?!create)/.test(pathname);

  const resolvedNav =
    activeNav ?? (isDeliveriesSection ? "deliveries" : "dashboard");

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", id: "dashboard" as const },
    {
      label: "Deliveries",
      href: "/dashboard/deliveries",
      id: "deliveries" as const,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className={`${DASHBOARD_SHELL} flex h-16 items-center justify-between gap-4`}>
        <div className="flex min-w-0 items-center gap-6 sm:gap-8">
          <Link
            href="/dashboard"
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
          >
            <Logo className="text-xl" />
          </Link>

          <nav
            className="hidden items-center gap-6 sm:flex"
            aria-label="Dashboard"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 ${
                  resolvedNav === link.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={resolvedNav === link.id ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <UserMenu />
      </div>
    </header>
  );
}
