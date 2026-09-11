import Link from "next/link";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { IconArrowLeft } from "@/dashboard/components/icons";

export default function SafetyComplianceHeader() {
  return (
    <div className="space-y-4">
      <Link
        href={DASHBOARD_PATH}
        className="inline-flex cursor-pointer items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <div className="space-y-2">
        <h1 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Safe &amp; Compliant
        </h1>
        <p className="text-body text-muted-foreground">
          How Doot keeps deliveries legal, safe, and compliant with Indian regulations.
        </p>
      </div>
    </div>
  );
}
