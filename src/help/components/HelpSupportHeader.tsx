import Link from "next/link";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { IconArrowLeft } from "@/dashboard/components/icons";

export default function HelpSupportHeader() {
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
          Help &amp; support
        </h1>
        <p className="text-body text-muted-foreground">
          Find answers, get in touch with our team, and explore quick links.
        </p>
      </div>
    </div>
  );
}
