import Link from "next/link";
import {
  IconArrowRight,
  IconPackage,
  IconPlusCircle,
} from "@/dashboard/components/icons";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { ACCOUNT_SETTINGS_PATH } from "@/account/paths";
import { DELIVERIES_PATH } from "@/deliveries/paths";

const links = [
  {
    href: DELIVERIES_PATH,
    label: "View deliveries",
    description: "See your delivery history and status.",
    icon: IconPackage,
  },
  {
    href: CREATE_DELIVERY_PATH,
    label: "Create a delivery",
    description: "Book a new pickup and drop-off.",
    icon: IconPlusCircle,
  },
  {
    href: ACCOUNT_SETTINGS_PATH,
    label: "Account settings",
    description: "Update profile and preferences.",
    icon: null,
  },
];

function IconUser({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" strokeLinecap="round" />
    </svg>
  );
}

export default function QuickLinksCard() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm">
      <h3 className="text-body font-bold text-foreground">Quick links</h3>
      <p className="mt-1 text-caption text-muted-foreground">
        Jump to common actions across the platform.
      </p>

      <ul className="mt-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon ?? IconUser;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-3 transition-colors hover:bg-surface/50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-small font-semibold text-foreground">
                    {link.label}
                  </span>
                  <span className="block text-caption text-muted-foreground">
                    {link.description}
                  </span>
                </span>
                <IconArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
