import Link from "next/link";
import { SAFETY_COMPLIANCE_PATH } from "@/safety/paths";
import { IconArrowRight, IconShieldFilled } from "./icons";

type SafetyComplianceCardProps = {
  variant?: "default" | "create";
  className?: string;
};

export default function SafetyComplianceCard({
  variant = "default",
  className = "",
}: SafetyComplianceCardProps) {
  const isCreate = variant === "create";

  return (
    <section
      className={`min-w-0 w-full max-w-full rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-3.5 sm:p-4 lg:landscape:p-5 xl:p-5 ${className}`}
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:h-9 sm:w-9">
          <IconShieldFilled className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-small font-bold text-emerald-700 sm:text-body">
            Safe & Compliant
          </h3>
          <p
            className={`mt-1.5 break-words leading-relaxed text-muted-foreground sm:mt-2 ${isCreate ? "text-caption sm:text-small" : "text-small"}`}
          >
            {isCreate
              ? "We follow Indian laws and do not allow illegal items. You are responsible for accurate declarations and safe packaging."
              : "All deliveries follow Indian transport and logistics regulations. You are responsible for accurate declarations, safe packaging, and compliance with prohibited-items rules."}
          </p>
          <Link
            href={SAFETY_COMPLIANCE_PATH}
            className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-caption font-semibold text-emerald-700 transition-colors hover:text-emerald-800 sm:mt-4 sm:text-small"
          >
            Learn more
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
