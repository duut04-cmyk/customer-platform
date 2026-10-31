import type { Metadata } from "next";
import { Suspense } from "react";
import PublicPageShell from "@/common/components/PublicPageShell";
import HelpSupport from "@/help";

export const metadata: Metadata = {
  title: "Help & Support | Doot",
  description:
    "Find answers about booking local deliveries, payments, tracking, account access, and contacting Doot support.",
};

export default function HelpSupportPage() {
  return (
    <Suspense fallback={null}>
      <PublicPageShell>
        <HelpSupport />
      </PublicPageShell>
    </Suspense>
  );
}
