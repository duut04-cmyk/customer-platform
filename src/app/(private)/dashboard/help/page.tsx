import type { Metadata } from "next";
import HelpSupport from "@/help";

export const metadata: Metadata = {
  title: "Help & Support | Doot",
  description:
    "Find answers about booking local deliveries, payments, tracking, account access, and contacting Doot support.",
};

export default function DashboardHelpSupportPage() {
  return <HelpSupport embedded />;
}
