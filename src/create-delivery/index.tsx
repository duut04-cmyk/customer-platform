"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CreateDeliveryPageTopSection from "./components/CreateDeliveryPageTopSection";
import SafetyComplianceCard from "@/dashboard/components/SafetyComplianceCard";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import BestDeliveryOption, {
  BestDeliveryOptionHeader,
} from "./components/BestDeliveryOption";
import BackToDeliveryOptionLink from "./components/BackToDeliveryOptionLink";
import BookingDelivery, { BookingDeliveryHeader } from "./components/BookingDelivery";
import ConsentStep, { validateConsentStep } from "./components/ConsentStep";
import CreateDeliveryBackLink from "./components/CreateDeliveryBackLink";
import DeliveryConfirmed, {
  DeliveryConfirmedHeader,
} from "./components/DeliveryConfirmed";
import DeliveryProgress from "./components/DeliveryProgress";
import FindingDelivery from "./components/FindingDelivery";
import FindingDeliverySummaryCard from "./components/FindingDeliverySummaryCard";
import FindingTimeSlotCard from "./components/FindingTimeSlotCard";
import { getMockDeliveryRecommendation } from "./mockOrchestrationResult";
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
  MOCK_DELIVERY_ID,
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
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryFormData, string>>>(
    {},
  );
  const packagePhotoUrlsRef = useRef<string[]>([]);

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
    setStep("finding");
  };

  const handleFindingComplete = useCallback(() => {
    setRecommendation(getMockDeliveryRecommendation(data));
    setStep("best_option");
  }, [data]);

  const handleBookDelivery = () => {
    setStep("booking");
  };

  const handleBookingComplete = useCallback(() => {
    if (!recommendation) return;

    setBooking({
      deliveryId: MOCK_DELIVERY_ID,
      recommendation,
    });
    setStep("confirmed");
  }, [recommendation]);

  const handleBackToReview = () => {
    setRecommendation(null);
    setStep("review");
  };

  const handleBackToBestOption = () => {
    setStep("best_option");
  };

  const handleEditStep = (nextStep: FormStep, focus?: "pickup" | "dropoff") => {
    setPickupFocus(focus ?? null);
    setStep(nextStep);
  };

  const showProgress = isProgressStep(step);
  const showStepNav =
    step === "pickup" ||
    step === "package" ||
    step === "requirements" ||
    step === "consent";
  const showFormLayout = !isPostReviewStep(step);

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
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-4 lg:space-y-5">
        <CreateDeliveryPageTopSection showHeader={showFormLayout} />

        {showFormLayout && (
          <div className="mt-6 space-y-4 lg:mt-8 lg:space-y-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[auto_1fr] lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_420px]">
              {showProgress ? (
                <div className="lg:col-start-1 lg:row-start-1">
                  <DeliveryProgress current={step} />
                </div>
              ) : null}
              <div className="rounded-xl border border-border bg-background p-5 shadow-sm md:p-6 lg:col-start-1 lg:row-start-2">
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

              <aside className="flex flex-col gap-4 lg:col-start-2 lg:row-start-2">
                <YourDeliverySummaryCard
                  data={data}
                  currentStep={isProgressStep(step) ? step : undefined}
                />
                <SafetyComplianceCard variant="create" />
              </aside>
            </div>
          </div>
        )}

        {step === "finding" && (
          <div className="space-y-5">
            <CreateDeliveryBackLink />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_420px]">
              <FindingDelivery
                data={data}
                onComplete={handleFindingComplete}
                onEdit={handleEditStep}
              />
              <aside className="flex flex-col gap-4">
                <FindingTimeSlotCard data={data} />
                <FindingDeliverySummaryCard data={data} />
                <SafetyComplianceCard variant="create" />
              </aside>
            </div>
          </div>
        )}

        {step === "best_option" && recommendation && (
          <div className="space-y-5">
            <CreateDeliveryBackLink />
            <BestDeliveryOptionHeader />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_420px]">
              <BestDeliveryOption
                recommendation={recommendation}
                formData={data}
                onBook={handleBookDelivery}
                onBack={handleBackToReview}
              />
              <aside className="flex flex-col gap-4">
                <YourDeliverySummaryCard data={data} currentStep="review" />
                <SafetyComplianceCard variant="create" />
              </aside>
            </div>
          </div>
        )}
        {step === "booking" && recommendation && (
          <div className="space-y-5">
            <BackToDeliveryOptionLink onClick={handleBackToBestOption} />
            <BookingDeliveryHeader />
            <BookingDelivery
              recommendation={recommendation}
              formData={data}
              onComplete={handleBookingComplete}
            />
          </div>
        )}
        {step === "confirmed" && booking && (
          <div className="space-y-5">
            <CreateDeliveryBackLink />
            <DeliveryConfirmedHeader />
            <DeliveryConfirmed booking={booking} formData={data} />
          </div>
        )}
      </div>
    </main>
  );
}
