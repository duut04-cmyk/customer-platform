import type { Metadata } from "next";
import { Suspense } from "react";
import PublicPageShell from "@/common/components/PublicPageShell";
import SafetyCompliancePage from "@/safety";

export const metadata: Metadata = {
  title: "Safety & Compliance | Doot",
  description:
    "Prohibited items, packaging guidance, OTP handoff safety, and customer responsibilities for Doot local deliveries.",
};

export default function SafetyComplianceRoutePage() {
  return (
    <Suspense fallback={null}>
      <PublicPageShell>
        <SafetyCompliancePage />
      </PublicPageShell>
    </Suspense>
  );
}
