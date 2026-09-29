import Link from "next/link";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";

export const metadata = {
  title: "Payment received | Doot",
  description: "Cashfree payment return page",
};

export default function CheckoutSuccessPage() {
  return (
    <main className={`${DASHBOARD_MAIN} min-w-0 bg-white`}>
      <div className="mx-auto max-w-lg space-y-6 py-8 md:py-12">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white"
            aria-hidden="true"
          >
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
              Payment submitted
            </h1>
            <p className="text-body text-muted-foreground">
              If you completed payment in Cashfree, Doot will confirm it on our servers.
              You can close this tab and return to your booking, or open your deliveries
              list to check status.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/create-delivery"
            className="inline-flex h-11 items-center justify-center rounded-[6px] bg-accent px-6 text-body font-semibold text-accent-foreground"
          >
            Back to create delivery
          </Link>
          <Link
            href="/deliveries"
            className="inline-flex h-11 items-center justify-center rounded-[6px] border border-border bg-background px-6 text-body font-semibold text-foreground"
          >
            View deliveries
          </Link>
        </div>

        <p className="text-caption text-muted-foreground">
          Booking is only confirmed after payment is verified and the delivery is booked
          with the partner. If the booking step is still open, wait there until it
          finishes.
        </p>
      </div>
    </main>
  );
}
