import Link from "next/link";
import { IconArrowRight } from "@/dashboard/components/icons";
import { HELP_SUPPORT_PATH } from "@/help/paths";

function IconMessage({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DetailNeedHelpCard() {
  return (
    <section className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <IconMessage />
        </span>
        <div>
          <h3 className="text-body font-bold text-emerald-700">Need help?</h3>
          <p className="mt-2 text-small leading-relaxed text-muted-foreground">
            For any changes or issues with this delivery, contact our support team.
          </p>
          <Link
            href={HELP_SUPPORT_PATH}
            className="mt-4 inline-flex items-center gap-1.5 text-small font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            Contact support
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
