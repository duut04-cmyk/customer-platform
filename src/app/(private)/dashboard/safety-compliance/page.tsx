import type { Metadata } from "next";
import SafetyCompliancePage from "@/safety";

export const metadata: Metadata = {
  title: "Safety & Compliance | Doot",
  description:
    "Prohibited items, packaging guidance, OTP handoff safety, and customer responsibilities for Doot local deliveries.",
};

export default function DashboardSafetyCompliancePage() {
  return <SafetyCompliancePage embedded />;
}
