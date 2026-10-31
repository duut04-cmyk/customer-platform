import ContactSupportCard from "./components/ContactSupportCard";
import HelpFaqSection from "./components/HelpFaqSection";
import HelpGettingStarted from "./components/HelpGettingStarted";
import HelpSupportHeader from "./components/HelpSupportHeader";
import QuickLinksCard from "./components/QuickLinksCard";
import SafetyComplianceCard from "@/dashboard/components/SafetyComplianceCard";

export default function HelpSupport() {
  return (
    <div className="site-content py-10 sm:py-12 md:py-14">
      <div className="space-y-6 lg:space-y-8">
        <HelpSupportHeader />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-6">
          <div className="flex flex-col gap-5">
            <HelpGettingStarted />
            <HelpFaqSection />
            <div className="flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                i
              </span>
              <p className="text-caption leading-relaxed text-muted-foreground md:text-small">
                For an active delivery, open tracking from your Deliveries list. Use any
                driver contact details shown when available, and email support for
                account or booking issues.
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
    </div>
  );
}
