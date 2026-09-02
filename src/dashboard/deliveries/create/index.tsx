"use client";

import { useCallback, useState } from "react";
import DashboardHeader from "@/dashboard/components/DashboardHeader";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import CreateDeliveryHeader from "./components/CreateDeliveryHeader";
import DeliveryConfirmed from "./components/DeliveryConfirmed";
import DeliveryProgress from "./components/DeliveryProgress";
import FindingDelivery from "./components/FindingDelivery";
import PackageStep, { validatePackageStep } from "./components/PackageStep";
import PickupDropStep, { validatePickupStep } from "./components/PickupDropStep";
import RequirementsStep, {
  validateRequirementsStep,
} from "./components/RequirementsStep";
import ReviewStep from "./components/ReviewStep";
import StepNavigation from "./components/StepNavigation";
import {
  initialDeliveryFormData,
  type DeliveryFormData,
  type FormStep,
  type ProgressStep,
} from "./types";

const stepOrder: FormStep[] = [
  "pickup",
  "package",
  "requirements",
  "review",
];

function isProgressStep(step: FormStep): step is ProgressStep {
  return stepOrder.includes(step);
}

export default function CreateDelivery() {
  const [step, setStep] = useState<FormStep>("pickup");
  const [data, setData] = useState<DeliveryFormData>(initialDeliveryFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DeliveryFormData, string>>
  >({});

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
    setStep("finding");
  };

  const handleFindingComplete = useCallback(() => {
    setStep("confirmed");
  }, []);

  const showProgress = isProgressStep(step);
  const showStepNav =
    step === "pickup" || step === "package" || step === "requirements";

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
      return (
        !data.packageType ||
        !data.length.trim() ||
        !data.width.trim() ||
        !data.height.trim() ||
        !data.weight.trim()
      );
    }
    if (step === "requirements") {
      return !data.timing;
    }
    return false;
  })();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className={DASHBOARD_MAIN}>
        {step !== "finding" && step !== "confirmed" && (
          <CreateDeliveryHeader />
        )}
        {showProgress && <DeliveryProgress current={step} />}

        {step === "pickup" && (
          <PickupDropStep data={data} errors={errors} onChange={updateData} />
        )}
        {step === "package" && (
          <PackageStep data={data} errors={errors} onChange={updateData} />
        )}
        {step === "requirements" && (
          <RequirementsStep data={data} errors={errors} onChange={updateData} />
        )}
        {step === "review" && (
          <ReviewStep
            data={data}
            onEdit={setStep}
            onFindDelivery={handleFindDelivery}
          />
        )}
        {step === "finding" && (
          <FindingDelivery onComplete={handleFindingComplete} />
        )}
        {step === "confirmed" && <DeliveryConfirmed data={data} />}

        {showStepNav && (
          <StepNavigation
            showBack={step !== "pickup"}
            continueDisabled={continueDisabled}
            onBack={goBack}
            onContinue={goNext}
          />
        )}
      </main>
    </div>
  );
}
