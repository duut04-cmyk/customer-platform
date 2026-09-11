import Link from "next/link";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { IconArrowLeft } from "@/dashboard/components/icons";

export default function AccountSettingsHeader() {
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
          Account settings
        </h1>
        <p className="text-body text-muted-foreground">
          Manage your profile, notifications, and security preferences.
        </p>
      </div>
    </div>
  );
}
