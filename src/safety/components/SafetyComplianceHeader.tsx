"use client";

import Link from "next/link";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { IconArrowLeft } from "@/dashboard/components/icons";
import { useAuthStore } from "@/stores/auth.store";

type SafetyComplianceHeaderProps = {
  /** Hide back link when already inside the dashboard shell. */
  embedded?: boolean;
};

export default function SafetyComplianceHeader({
  embedded = false,
}: SafetyComplianceHeaderProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const backHref = !isInitializing && isAuthenticated ? DASHBOARD_PATH : "/";
  const backLabel =
    !isInitializing && isAuthenticated ? "Back to dashboard" : "Back to home";

  return (
    <div className="space-y-4">
      {!embedded ? (
        <Link
          href={backHref}
          className="inline-flex cursor-pointer items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      ) : null}
      <div className="space-y-2">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-accent">
          Trust &amp; compliance
        </p>
        <h1 className="text-[1.75rem] font-bold tracking-tight text-foreground md:text-[2.25rem]">
          Safety &amp; compliance
        </h1>
        <p className="max-w-2xl text-body text-muted-foreground">
          How Doot keeps local deliveries safer and clearer—prohibited items, packaging,
          OTP handoffs, and your responsibilities as a customer.
        </p>
      </div>
    </div>
  );
}
