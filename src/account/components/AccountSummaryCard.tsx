import Link from "next/link";
import { IconArrowRight } from "@/dashboard/components/icons";
import { HELP_SUPPORT_PATH } from "@/help/paths";
import { MOCK_USER } from "../mockUser";

export default function AccountSummaryCard() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-body-lg font-bold text-accent-foreground">
          {MOCK_USER.initials}
        </span>
        <h3 className="mt-4 text-body font-bold text-foreground">{MOCK_USER.name}</h3>
        <p className="mt-0.5 text-small text-muted-foreground">{MOCK_USER.email}</p>
        <p className="mt-2 text-caption text-muted-foreground">
          Member since {MOCK_USER.memberSince}
        </p>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <Link
          href={HELP_SUPPORT_PATH}
          className="inline-flex items-center gap-1.5 text-small font-semibold text-accent hover:text-accent/80"
        >
          Help &amp; support
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
