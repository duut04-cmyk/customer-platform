import type { ReactNode } from "react";
import Link from "next/link";
import DashboardInPageTopSection from "@/dashboard/components/DashboardInPageTopSection";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import ContactSupportCard from "@/help/components/ContactSupportCard";
import QuickLinksCard from "@/help/components/QuickLinksCard";
import { HELP_SUPPORT_APP_PATH, HELP_SUPPORT_PATH } from "@/help/paths";
import SafetyComplianceHeader from "./components/SafetyComplianceHeader";
import {
  CUSTOMER_RESPONSIBILITIES,
  LIABILITY_NOTE,
  OTP_SAFETY,
  PACKAGING_GUIDANCE,
  PROHIBITED_ITEMS,
  SAFETY_DISCLAIMER,
  SAFETY_INTRO,
  WHEN_TO_CONTACT,
} from "./safetyContent";

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-[1.25rem] border border-border bg-white p-5 shadow-sm md:p-7">
      <h2 className="text-body-lg font-bold text-foreground md:text-[1.35rem]">
        {title}
      </h2>
      <div className="mt-4 text-small leading-relaxed text-muted-foreground md:text-[0.9375rem]">
        {children}
      </div>
    </section>
  );
}

type SafetyCompliancePageProps = {
  /** Render inside the authenticated dashboard shell. */
  embedded?: boolean;
};

export default function SafetyCompliancePage({
  embedded = false,
}: SafetyCompliancePageProps) {
  const helpHref = embedded ? HELP_SUPPORT_APP_PATH : HELP_SUPPORT_PATH;

  const content = (
    <div className="space-y-6 lg:space-y-8">
      {embedded ? <DashboardInPageTopSection /> : null}
      <SafetyComplianceHeader embedded={embedded} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-6">
        <div className="flex flex-col gap-5">
          <InfoCard title={SAFETY_INTRO.title}>
            <div className="space-y-3">
              {SAFETY_INTRO.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Prohibited items">
            <p>
              Your package must not include illegal or restricted items. In particular,
              do not send:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 sm:columns-2 sm:gap-x-6">
              {PROHIBITED_ITEMS.map((item) => (
                <li key={item} className="break-inside-avoid text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Packaging &amp; declaration">
            <ul className="list-disc space-y-1.5 pl-5">
              {PACKAGING_GUIDANCE.map((item) => (
                <li key={item} className="text-foreground">
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

          <InfoCard title={OTP_SAFETY.title}>
            <p>{OTP_SAFETY.body}</p>
          </InfoCard>

          <InfoCard title={LIABILITY_NOTE.title}>
            <div className="space-y-3">
              {LIABILITY_NOTE.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </InfoCard>

          <InfoCard title={WHEN_TO_CONTACT.title}>
            <ul className="list-disc space-y-1.5 pl-5">
              {WHEN_TO_CONTACT.items.map((item) => (
                <li key={item} className="text-foreground">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-foreground">{WHEN_TO_CONTACT.contact}</p>
            <p className="mt-2">
              More answers are on the{" "}
              <Link
                href={helpHref}
                className="font-semibold text-accent hover:underline"
              >
                Help &amp; support
              </Link>{" "}
              page.
            </p>
          </InfoCard>

          <p className="rounded-xl border border-border bg-white/80 px-4 py-3 text-caption leading-relaxed text-muted-foreground">
            {SAFETY_DISCLAIMER}
          </p>
        </div>

        <aside className="flex flex-col gap-4">
          <ContactSupportCard />
          <QuickLinksCard />
        </aside>
      </div>
    </div>
  );

  if (embedded) {
    return <main className={`${DASHBOARD_MAIN} bg-white`}>{content}</main>;
  }

  return <div className="site-content py-10 sm:py-12 md:py-14">{content}</div>;
}
