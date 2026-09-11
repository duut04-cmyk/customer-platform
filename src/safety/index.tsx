import type { ReactNode } from "react";
import DashboardInPageTopSection from "@/dashboard/components/DashboardInPageTopSection";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import {
  CUSTOMER_RESPONSIBILITIES,
  PROHIBITED_ITEMS,
} from "@/compliance/prohibitedItems";
import ContactSupportCard from "@/help/components/ContactSupportCard";
import QuickLinksCard from "@/help/components/QuickLinksCard";
import SafetyComplianceHeader from "./components/SafetyComplianceHeader";

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
      <h2 className="text-body-lg font-bold text-foreground">{title}</h2>
      <div className="mt-4 text-small leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function SafetyCompliancePage() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-4 lg:space-y-5">
        <DashboardInPageTopSection />
        <SafetyComplianceHeader />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-5">
          <div className="flex flex-col gap-4">
            <InfoCard title="Our commitment">
              <p>
                Doot connects you with verified delivery partners across India. Every
                booking must comply with applicable transport, logistics, and consumer
                protection laws. We do not accept illegal, dangerous, or undeclared
                items.
              </p>
            </InfoCard>

            <InfoCard title="Prohibited items">
              <p>Your package must not include any of the following:</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 sm:columns-2 sm:gap-x-6">
                {PROHIBITED_ITEMS.map((item) => (
                  <li key={item} className="break-inside-avoid text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </InfoCard>

            <InfoCard title="Your responsibilities">
              <ul className="list-disc space-y-1.5 pl-5">
                {CUSTOMER_RESPONSIBILITIES.map((item) => (
                  <li key={item} className="text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </InfoCard>

            <InfoCard title="OTP & handoff safety">
              <p>
                Pickup and delivery OTP codes verify that the right person receives the
                package. Only share codes with your assigned driver at pickup and with
                the intended recipient at delivery. Never post OTP codes publicly or
                share them with unknown third parties.
              </p>
            </InfoCard>
          </div>

          <aside className="flex flex-col gap-4">
            <ContactSupportCard />
            <QuickLinksCard />
          </aside>
        </div>
      </div>
    </main>
  );
}
