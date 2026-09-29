"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createAndOrchestrate,
  mapFormToCreateRequest,
  mapOrchestrationToRecommendation,
} from "@/api/deliveries";
import {
  completeBookingWithPayment,
  type BookingPaymentPhase,
} from "@/lib/payments/complete-booking-with-payment";
import { ApiError } from "@/api/errors";
import CreateDeliveryPageTopSection from "./components/CreateDeliveryPageTopSection";
import SafetyComplianceCard from "@/dashboard/components/SafetyComplianceCard";
import { CREATE_DELIVERY_GRID, DASHBOARD_MAIN } from "@/dashboard/components/layout";
import BestDeliveryOption from "./components/BestDeliveryOption";
import BookingDelivery, { BookingDeliveryHeader } from "./components/BookingDelivery";
import ConsentStep, { validateConsentStep } from "./components/ConsentStep";
import CreateDeliveryFlowPageHeader from "./components/CreateDeliveryFlowPageHeader";
import DeliveryConfirmed, {
  DeliveryConfirmedHeader,
} from "./components/DeliveryConfirmed";
import DeliveryProgress from "./components/DeliveryProgress";
import FindingDelivery from "./components/FindingDelivery";
import FindingDeliverySummaryCard from "./components/FindingDeliverySummaryCard";
import FindingTimeSlotCard from "./components/FindingTimeSlotCard";
import PackageStep, { validatePackageStep } from "./components/PackageStep";
import PickupDropStep, { validatePickupStep } from "./components/PickupDropStep";
import RequirementsStep, {
  validateRequirementsStep,
} from "./components/RequirementsStep";
import ReviewStep from "./components/ReviewStep";
import StepNavigation from "./components/StepNavigation";
import YourDeliverySummaryCard from "./components/YourDeliverySummaryCard";
import {
  hasComplianceConsent,
  initialDeliveryFormData,
  isPackageStepComplete,
  type BookingResult,
  type DeliveryFormData,
  type DeliveryRecommendation,
  type FormStep,
  type ProgressStep,
} from "./types";

const stepOrder: ProgressStep[] = [
  "pickup",
  "package",
  "requirements",
  "consent",
  "review",
];

const continueLabels: Record<ProgressStep, string> = {
  pickup: "Continue to package",
  package: "Continue to timing",
  requirements: "Continue to consent",
  consent: "Continue to review",
  review: "Continue",
};

function isProgressStep(step: FormStep): step is ProgressStep {
  return stepOrder.includes(step as ProgressStep);
}

function isPostReviewStep(step: FormStep): boolean {
  return (
    step === "finding" ||
    step === "best_option" ||
    step === "booking" ||
    step === "confirmed"
  );
}

export default function CreateDelivery() {
  const [step, setStep] = useState<FormStep>("pickup");
  const [pickupFocus, setPickupFocus] = useState<"pickup" | "dropoff" | null>(null);
  const [data, setData] = useState<DeliveryFormData>(initialDeliveryFormData);
  const [recommendation, setRecommendation] = useState<DeliveryRecommendation | null>(
    null,
  );
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [createdDeliveryId, setCreatedDeliveryId] = useState<string | null>(null);
  const [orchestrationError, setOrchestrationError] = useState<string | null>(null);
  const pendingRecommendationRef = useRef<DeliveryRecommendation | null>(null);
  const findingAnimationDoneRef = useRef(false);
  const orchestrationStartedRef = useRef(false);
  const packagePhotoUrlsRef = useRef<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryFormData, string>>>(
    {},
  );

  useEffect(() => {
    packagePhotoUrlsRef.current = data.packagePhotoUrls;
  }, [data.packagePhotoUrls]);

  useEffect(() => {
    return () => {
      packagePhotoUrlsRef.current.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, []);

  useEffect(() => {
    if (step !== "finding") {
      orchestrationStartedRef.current = false;
      return;
    }
    if (orchestrationStartedRef.current) return;
    orchestrationStartedRef.current = true;
    setOrchestrationError(null);
    pendingRecommendationRef.current = null;
    findingAnimationDoneRef.current = false;

    void (async () => {
      try {
        const body = mapFormToCreateRequest(data);
        const result = await createAndOrchestrate(body, crypto.randomUUID());
        setCreatedDeliveryId(result.deliveryId);
        const mapped = mapOrchestrationToRecommendation(result.orchestration);
        pendingRecommendationRef.current = mapped;
        if (findingAnimationDoneRef.current) {
          setRecommendation(mapped);
          setStep("best_option");
          pendingRecommendationRef.current = null;
        }
      } catch (err) {
        setOrchestrationError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unable to find a delivery option. Please try again.",
        );
      }
    })();
  }, [step, data]);

  const updateData = useCallback((updates: Partial<DeliveryFormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(updates) as (keyof DeliveryFormData)[]) {
        delete next[key];
      }
      return next;
    });
  }, []);

  const validateCurrentStep = useCallback(() => {
    if (step === "pickup") return validatePickupStep(data);
    if (step === "package") return validatePackageStep(data);
    if (step === "requirements") return validateRequirementsStep(data);
    if (step === "consent") return validateConsentStep(data);
    return {};
  }, [step, data]);

  const goNext = () => {
    const stepErrors = validateCurrentStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    const index = stepOrder.indexOf(step as ProgressStep);
    if (index >= 0 && index < stepOrder.length - 1) {
      setStep(stepOrder[index + 1]);
    }
  };

  const goBack = () => {
    setErrors({});
    const index = stepOrder.indexOf(step as ProgressStep);
    if (index > 0) {
      setStep(stepOrder[index - 1]);
    }
  };

  const handleFindDelivery = () => {
    setRecommendation(null);
    setBooking(null);
    setCreatedDeliveryId(null);
    setOrchestrationError(null);
    setStep("finding");
  };

  const handleFindingAnimationComplete = useCallback(() => {
    findingAnimationDoneRef.current = true;
    const pending = pendingRecommendationRef.current;
    if (pending) {
      setRecommendation(pending);
      setStep("best_option");
      pendingRecommendationRef.current = null;
    }
  }, []);

  const handleBookDelivery = () => {
    setStep("booking");
  };

  const handleBookingComplete = useCallback(
    async (
      onPhase?: (phase: BookingPaymentPhase) => void,
    ): Promise<BookingResult | null> => {
      if (!recommendation || !createdDeliveryId) return null;
      try {
        const confirmed = await completeBookingWithPayment({
          deliveryId: createdDeliveryId,
          onPhase,
        });
        const result: BookingResult = {
          deliveryId: createdDeliveryId,
          deliveryReference: confirmed.deliveryReference,
          recommendation,
        };
        setBooking(result);
        setStep("confirmed");
        return result;
      } catch (err) {
        throw err instanceof ApiError
          ? err
          : new ApiError({
              status: 0,
              message:
                err instanceof Error ? err.message : "Booking confirmation failed.",
            });
      }
    },
    [recommendation, createdDeliveryId],
  );

  const handleBackToReview = () => {
    setRecommendation(null);
    setStep("review");
  };

  const showProgress = isProgressStep(step);
  const showStepNav =
    step === "pickup" ||
    step === "package" ||
    step === "requirements" ||
    step === "consent";
  const showFormLayout = !isPostReviewStep(step);
  const showCreateDeliveryTopSection =
    showFormLayout ||
    step === "booking" ||
    step === "confirmed" ||
    step === "best_option";
  const showCreateDeliveryTitle = showFormLayout;

  const handleEditStep = (nextStep: FormStep, focus?: "pickup" | "dropoff") => {
    setPickupFocus(focus ?? null);
    setStep(nextStep);
  };

  const continueDisabled = (() => {
    if (step === "pickup") {
      return (
        !data.pickupAddress.trim() ||
        !data.dropAddress.trim() ||
        !data.pickupContactName.trim() ||
        !data.pickupContactPhone.trim() ||
        !data.dropContactName.trim() ||
        !data.dropContactPhone.trim()
      );
    }
    if (step === "package") {
      return !isPackageStepComplete(data);
    }
    if (step === "requirements") {
      if (!data.timing) return true;
      if (data.timing === "scheduled") {
        if (!data.scheduledDate || !data.pickupWindowStart || !data.pickupWindowEnd) {
          return true;
        }
        if (data.pickupWindowEnd <= data.pickupWindowStart) return true;
      }
      return false;
    }
    if (step === "consent") {
      return !hasComplianceConsent(data);
    }
    return false;
  })();

  const stepContent = (
    <>
      {step === "pickup" && (
        <PickupDropStep
          data={data}
          errors={errors}
          onChange={updateData}
          focusSection={pickupFocus}
          onFocusHandled={() => setPickupFocus(null)}
        />
      )}
      {step === "package" && (
        <PackageStep data={data} errors={errors} onChange={updateData} />
      )}
      {step === "requirements" && (
        <RequirementsStep data={data} errors={errors} onChange={updateData} />
      )}
      {step === "consent" && (
        <ConsentStep data={data} errors={errors} onChange={updateData} />
      )}
      {step === "review" && (
        <ReviewStep
          data={data}
          onEdit={handleEditStep}
          onFindDelivery={handleFindDelivery}
        />
      )}
    </>
  );

  return (
    <main className={`${DASHBOARD_MAIN} min-w-0 overflow-x-hidden bg-white`}>
      <div className="min-w-0 space-y-4 lg:space-y-5">
        {showCreateDeliveryTopSection ? (
          <CreateDeliveryPageTopSection showHeader={showCreateDeliveryTitle} />
        ) : null}

        {showFormLayout && (
          <div className="mt-6 min-w-0 space-y-4 lg:mt-8 lg:space-y-5">
            <div
              className={`grid min-w-0 w-full max-w-full gap-4 xl:grid-rows-[auto_1fr] xl:gap-x-5 ${CREATE_DELIVERY_GRID}`}
            >
              {showProgress ? (
                <div className="min-w-0 w-full max-w-full overflow-visible xl:col-start-1 xl:row-start-1">
                  <DeliveryProgress current={step} />
                </div>
              ) : null}
              <div className="min-w-0 rounded-xl border border-border bg-background p-4 shadow-sm sm:p-5 md:p-6 xl:col-start-1 xl:row-start-2">
                {stepContent}
                {showStepNav && (
                  <StepNavigation
                    showBack={step !== "pickup"}
                    continueDisabled={continueDisabled}
                    continueLabel={continueLabels[step]}
                    onBack={goBack}
                    onContinue={goNext}
                  />
                )}
              </div>

              <aside className="flex min-w-0 w-full max-w-full flex-col gap-3 sm:gap-4 xl:col-start-2 xl:row-start-2">
                <YourDeliverySummaryCard
                  data={data}
                  currentStep={isProgressStep(step) ? step : undefined}
                />
                <SafetyComplianceCard variant="create" className="p-3 sm:p-4" />
              </aside>
            </div>
          </div>
        )}

        {step === "finding" && (
          <div className="space-y-6 lg:space-y-8">
            <CreateDeliveryFlowPageHeader
              title={
                data.timing === "scheduled"
                  ? "When should we deliver?"
                  : "Finding the best delivery option"
              }
              subtitle={
                orchestrationError
                  ? orchestrationError
                  : data.timing === "scheduled"
                    ? "You've selected a delivery time slot. Now we're finding the best available service for your request."
                    : "Doot is checking available delivery services based on price, delivery time, package compatibility, and your requirements."
              }
              showBackToDashboard={false}
            />

            {orchestrationError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-body font-semibold text-red-800">
                  Could not find a delivery option
                </p>
                <p className="mt-2 text-small text-red-700">{orchestrationError}</p>
                <button
                  type="button"
                  className="mt-4 text-small font-semibold text-accent"
                  onClick={handleBackToReview}
                >
                  Back to review
                </button>
              </div>
            ) : (
              <div
                className={`grid min-w-0 w-full max-w-full gap-4 xl:items-start xl:gap-x-5 ${CREATE_DELIVERY_GRID}`}
              >
                <FindingDelivery
                  data={data}
                  onComplete={handleFindingAnimationComplete}
                  onEdit={handleEditStep}
                />
                <aside className="flex min-w-0 w-full max-w-full flex-col gap-3 sm:gap-4">
                  <FindingTimeSlotCard data={data} />
                  <FindingDeliverySummaryCard data={data} />
                  <SafetyComplianceCard variant="create" className="p-3 sm:p-4" />
                </aside>
              </div>
            )}
          </div>
        )}

        {step === "best_option" && recommendation && (
          <div className="mt-6 space-y-6 lg:mt-8 lg:space-y-8">
            <div className="space-y-1">
              <h1 className="text-heading font-bold tracking-tight text-foreground">
                Best delivery option
              </h1>
              <p className="text-body text-muted-foreground">
                We found the best available option based on price, delivery time,
                availability, and your requirements.
              </p>
            </div>

            <div
              className={`grid min-w-0 w-full max-w-full gap-4 xl:items-start xl:gap-x-5 ${CREATE_DELIVERY_GRID}`}
            >
              <BestDeliveryOption
                recommendation={recommendation}
                formData={data}
                onBook={handleBookDelivery}
                onBack={handleBackToReview}
              />
              <aside className="flex min-w-0 w-full max-w-full flex-col gap-3 sm:gap-4">
                <YourDeliverySummaryCard data={data} currentStep="review" />
                <SafetyComplianceCard variant="create" className="p-3 sm:p-4" />
              </aside>
            </div>
          </div>
        )}
        {step === "booking" && recommendation && createdDeliveryId && (
          <div className="mt-6 space-y-5 lg:mt-8">
            <BookingDeliveryHeader />
            <BookingDelivery
              recommendation={recommendation}
              formData={data}
              onConfirm={handleBookingComplete}
            />
          </div>
        )}
        {step === "confirmed" && booking && (
          <div className="mt-6 space-y-5 lg:mt-8">
            <DeliveryConfirmedHeader />
            <DeliveryConfirmed booking={booking} formData={data} />
          </div>
        )}
      </div>
    </main>
  );
}
