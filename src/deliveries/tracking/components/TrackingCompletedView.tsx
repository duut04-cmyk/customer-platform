"use client";

import SafetyComplianceCard from "@/dashboard/components/SafetyComplianceCard";
import type { Delivery } from "../../types";
import CompletedDeliveryOverviewCard from "./CompletedDeliveryOverviewCard";
import CompletedThankYouCard from "./CompletedThankYouCard";
import DeliveryExperienceSurveyCard, {
  type DeliveryExperienceSubmitPayload,
} from "./DeliveryExperienceSurveyCard";
import TrackingPageHeader from "./TrackingPageHeader";

type TrackingCompletedViewProps = {
  delivery: Delivery;
  onSubmitExperience: (
    payload: DeliveryExperienceSubmitPayload,
  ) => void | Promise<void>;
};

export default function TrackingCompletedView({
  delivery,
  onSubmitExperience,
}: TrackingCompletedViewProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <TrackingPageHeader delivery={delivery} variant="completed" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-5">
        <div className="flex flex-col gap-4">
          <DeliveryExperienceSurveyCard
            initialRatings={delivery.customerExperienceRatings}
            initialComment={delivery.customerRatingComment}
            initialSubmitted={Boolean(delivery.ratedAt)}
            onSubmit={onSubmitExperience}
          />
          <CompletedDeliveryOverviewCard delivery={delivery} />
        </div>

        <aside className="flex flex-col gap-4">
          <CompletedThankYouCard />
          <SafetyComplianceCard />
        </aside>
      </div>
    </div>
  );
}
