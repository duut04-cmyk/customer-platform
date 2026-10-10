"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  advanceDevDeliveryStep,
  cancelDelivery,
  submitDeliveryExperience,
} from "@/api/deliveries/delivery.api";
import {
  canSimulateDeliveryProvider,
  devSimulateStepLabel,
  isDevDeliverySimulateEnabled,
} from "@/config/dev-delivery-simulate";
import { mapCancelReasonToBackend } from "@/api/deliveries/cancel-reasons";
import { ApiError } from "@/api/errors";
import type { CancelDeliveryReason } from "@/deliveries/customerCopy";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import type { Delivery } from "../types";
import TrackingCancelledView from "./components/TrackingCancelledView";
import type { DeliveryExperienceSubmitPayload } from "./components/DeliveryExperienceSurveyCard";
import TrackingCompletedView from "./components/TrackingCompletedView";
import TrackingFailedView from "./components/TrackingFailedView";
import TrackingInProgressView from "./components/TrackingInProgressView";

type TrackingPageProps = {
  delivery: Delivery;
  onRefresh: () => Promise<void>;
};

export default function TrackingPage({ delivery, onRefresh }: TrackingPageProps) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simulateError, setSimulateError] = useState<string | null>(null);
  const [simulateHint, setSimulateHint] = useState<string | null>(null);
  const showDevSimulate =
    isDevDeliverySimulateEnabled() &&
    canSimulateDeliveryProvider(delivery.providerCode);

  const handleCancel = useCallback(
    async (reason: CancelDeliveryReason, otherText?: string) => {
      setCancelling(true);
      setCancelError(null);
      try {
        const mapped = mapCancelReasonToBackend(reason, otherText);
        await cancelDelivery(
          delivery.id,
          {
            reasonCode: mapped.reasonCode,
            reasonMessage: mapped.reasonMessage,
          },
          crypto.randomUUID(),
        );
        await onRefresh();
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Could not cancel delivery.";
        setCancelError(message);
        throw err instanceof Error ? err : new Error(message);
      } finally {
        setCancelling(false);
      }
    },
    [delivery.id, onRefresh],
  );

  const handleSimulateStep = useCallback(async () => {
    setSimulating(true);
    setSimulateError(null);
    setSimulateHint(null);
    try {
      const result = await advanceDevDeliveryStep(delivery.id);
      const { devOtp, nextStep } = result.data;
      if (devOtp) {
        setSimulateHint(`Dev OTP: ${devOtp} (also sent flow skipped in simulation)`);
      } else if (nextStep) {
        setSimulateHint(`Next: ${devSimulateStepLabel(nextStep)}`);
      }
      await onRefresh();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not advance delivery simulation.";
      setSimulateError(message);
    } finally {
      setSimulating(false);
    }
  }, [delivery.id, onRefresh]);

  const handleSubmitExperience = async (payload: DeliveryExperienceSubmitPayload) => {
    const { comment, ...ratings } = payload;
    await submitDeliveryExperience(delivery.id, {
      ...ratings,
      comment: comment.trim() ? comment.trim() : null,
    });
    router.push("/dashboard");
  };

  const isCompleted = delivery.status === "delivered";
  const isCancelled = delivery.status === "cancelled";
  const isFailed = delivery.status === "failed";

  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-4 lg:space-y-5">
        {(cancelError || simulateError) && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-small text-red-700">
            {cancelError ?? simulateError}
          </p>
        )}
        {simulateHint && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-small text-amber-900">
            {simulateHint}
          </p>
        )}
        {isCompleted && (
          <TrackingCompletedView
            delivery={delivery}
            onSubmitExperience={handleSubmitExperience}
          />
        )}
        {isCancelled && <TrackingCancelledView delivery={delivery} />}
        {isFailed && <TrackingFailedView delivery={delivery} />}
        {!isCompleted && !isCancelled && !isFailed && (
          <TrackingInProgressView
            delivery={delivery}
            onCancel={handleCancel}
            cancelling={cancelling}
            showDevSimulate={showDevSimulate}
            onDevSimulate={handleSimulateStep}
            simulating={simulating}
          />
        )}
      </div>
    </main>
  );
}
