import Link from "next/link";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { IconArrowLeft } from "@/dashboard/components/icons";

export default function CreateDeliveryBackLink() {
  return (
    <Link
      href={DASHBOARD_PATH}
      className="inline-flex cursor-pointer items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <IconArrowLeft className="h-4 w-4" />
      Back to dashboard
    </Link>
  );
}
