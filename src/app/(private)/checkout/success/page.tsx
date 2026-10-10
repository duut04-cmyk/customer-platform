import { Suspense } from "react";
import CheckoutSuccessView from "./CheckoutSuccessView";

export const metadata = {
  title: "Payment received | Doot",
  description: "Cashfree payment return page",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[40vh] items-center justify-center bg-white px-4 text-small text-muted-foreground">
          Loading…
        </main>
      }
    >
      <CheckoutSuccessView />
    </Suspense>
  );
}
