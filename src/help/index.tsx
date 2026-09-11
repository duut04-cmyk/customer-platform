import DashboardInPageTopSection from "@/dashboard/components/DashboardInPageTopSection";
import SafetyComplianceCard from "@/dashboard/components/SafetyComplianceCard";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import ContactSupportCard from "./components/ContactSupportCard";
import HelpFaqSection from "./components/HelpFaqSection";
import HelpSupportHeader from "./components/HelpSupportHeader";
import QuickLinksCard from "./components/QuickLinksCard";

export default function HelpSupport() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-4 lg:space-y-5">
        <DashboardInPageTopSection />
        <HelpSupportHeader />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-5">
          <div className="flex flex-col gap-4">
            <HelpFaqSection />
            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                i
              </span>
              <p className="text-caption leading-relaxed text-muted-foreground">
                For urgent delivery issues, open the tracking page for your active
                delivery and contact your driver directly when available.
              </p>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <ContactSupportCard />
            <QuickLinksCard />
            <SafetyComplianceCard />
          </aside>
        </div>
      </div>
    </main>
  );
}
