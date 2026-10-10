import { Suspense } from "react";
import CreateDelivery from "@/create-delivery";

function CreateDeliveryFallback() {
  return (
    <main className="w-full min-w-0 max-w-full px-4 py-4 md:px-6 lg:px-6 xl:px-8 lg:py-6">
      <div
        className="flex min-h-[40vh] items-center justify-center text-body text-muted-foreground"
        role="status"
      >
        Loading create delivery…
      </div>
    </main>
  );
}

export default function CreateDeliveryPage() {
  return (
    <Suspense fallback={<CreateDeliveryFallback />}>
      <CreateDelivery />
    </Suspense>
  );
}
