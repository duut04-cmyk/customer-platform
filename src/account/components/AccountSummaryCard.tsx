"use client";

import Link from "next/link";
import { IconArrowRight } from "@/dashboard/components/icons";
import { getUserInitials } from "@/auth/user-display";
import { HELP_SUPPORT_PATH } from "@/help/paths";
import { useAuthStore } from "@/stores/auth.store";

export default function AccountSummaryCard() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-body-lg font-bold text-accent-foreground">
          {getUserInitials(user.name)}
        </span>
        <h3 className="mt-4 text-body font-bold text-foreground">{user.name}</h3>
        <p className="mt-0.5 text-small text-muted-foreground">{user.email}</p>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <Link
          href={HELP_SUPPORT_PATH}
          className="inline-flex items-center gap-1.5 text-small font-semibold text-accent hover:text-accent/80"
        >
          Help &amp; support
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
