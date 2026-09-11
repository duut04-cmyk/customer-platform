import Link from "next/link";
import { SAFETY_COMPLIANCE_PATH } from "@/safety/paths";
import { IconArrowRight, IconShieldFilled } from "./icons";

type SafetyComplianceCardProps = {
  variant?: "default" | "create";
};

export default function SafetyComplianceCard({
  variant = "default",
}: SafetyComplianceCardProps) {
  const isCreate = variant === "create";

  return (
    <section className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <IconShieldFilled className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-body font-bold text-emerald-700">Safe & Compliant</h3>
          <p className="mt-2 text-small leading-relaxed text-muted-foreground">
            {isCreate
              ? "We follow Indian laws and do not allow illegal items. You are responsible for accurate declarations and safe packaging."
              : "All deliveries follow Indian transport and logistics regulations. You are responsible for accurate declarations, safe packaging, and compliance with prohibited-items rules."}
          </p>
          <Link
            href={SAFETY_COMPLIANCE_PATH}
            className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-small font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            Learn more
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
