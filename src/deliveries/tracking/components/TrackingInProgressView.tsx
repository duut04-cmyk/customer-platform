"use client";

import { useState } from "react";
import Button from "@/common/components/Button";
import DetailDriverCard from "@/deliveries/detail/components/DetailDriverCard";
import DetailSafeCompliantCard from "@/deliveries/detail/components/DetailSafeCompliantCard";
import DetailServiceInfoCard from "@/deliveries/detail/components/DetailServiceInfoCard";
import type { CancelDeliveryReason } from "../../customerCopy";
import { canCancelDelivery, type Delivery } from "../../types";
import CancelDeliveryModal from "./CancelDeliveryModal";
import LiveTrackingCard from "./LiveTrackingCard";
import TrackingDeliverySummaryCard from "./TrackingDeliverySummaryCard";
import TrackingPageHeader from "./TrackingPageHeader";
import TrackingUnifiedTimeline from "./TrackingUnifiedTimeline";

type TrackingInProgressViewProps = {
  delivery: Delivery;
  onCancel: (reason: CancelDeliveryReason, otherText?: string) => void;
  cancelling?: boolean;
  showDevSimulate?: boolean;
  onDevSimulate?: () => void | Promise<void>;
  simulating?: boolean;
};

export default function TrackingInProgressView({
  delivery,
  onCancel,
  cancelling = false,
  showDevSimulate = false,
  onDevSimulate,
  simulating = false,
}: TrackingInProgressViewProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const showCancel = canCancelDelivery(delivery.status);

  return (
    <div className="space-y-6 lg:space-y-8">
      <TrackingPageHeader delivery={delivery} variant="in_progress" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex flex-col gap-4">
          <LiveTrackingCard delivery={delivery} />
          <TrackingUnifiedTimeline delivery={delivery} />
          <TrackingDeliverySummaryCard delivery={delivery} />
          {(showCancel || showDevSimulate) && (
            <div className="flex flex-wrap items-center gap-3">
              {showDevSimulate && onDevSimulate && (
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 rounded-[6px] border-dashed border-amber-300 px-5 text-small font-semibold text-amber-900 hover:bg-amber-50"
                  disabled={simulating}
                  onClick={() => void onDevSimulate()}
                >
                  {simulating ? "Simulating…" : "Simulate next step"}
                </Button>
              )}
              {showCancel && (
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 rounded-[6px] border-red-200 px-5 text-small font-semibold text-red-600 hover:bg-red-50"
                  onClick={() => setCancelOpen(true)}
                >
                  Cancel delivery
                </Button>
              )}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:portrait:grid-cols-2 lg:grid-cols-1 [&>*]:min-w-0">
            <DetailDriverCard delivery={delivery} />
            <DetailServiceInfoCard delivery={delivery} />
          </div>
          <DetailSafeCompliantCard />
        </aside>
      </div>

      <CancelDeliveryModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        confirming={cancelling}
        onConfirm={async (reason, otherText) => {
          try {
            await onCancel(reason, otherText);
            setCancelOpen(false);
          } catch {
            // Keep modal open; parent surfaces the error message.
          }
        }}
      />
    </div>
  );
}
