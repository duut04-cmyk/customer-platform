"use client";

import { useState } from "react";
import Button from "@/common/components/Button";
import type { CustomerExperienceRatings } from "../../types";

export type DeliveryExperienceSubmitPayload = CustomerExperienceRatings & {
  comment: string;
};

type DeliveryExperienceSurveyCardProps = {
  initialRatings?: CustomerExperienceRatings;
  initialComment?: string;
  /** True when a rating was already saved (includes legacy driver+delivery-only ratings). */
  initialSubmitted?: boolean;
  onSubmit: (payload: DeliveryExperienceSubmitPayload) => void | Promise<void>;
};

type ExperienceFormRatings = CustomerExperienceRatings;

const RATING_ROWS: {
  key: keyof ExperienceFormRatings;
  label: string;
  helper?: string;
}[] = [
  { key: "driverRating", label: "Driver performance" },
  { key: "platformRating", label: "Platform & booking" },
  { key: "deliveryRating", label: "Overall delivery" },
  {
    key: "timelinessRating",
    label: "Timeliness",
    helper: "Speed and delivery time",
  },
  {
    key: "packageHandlingRating",
    label: "Package handling",
    helper: "Care for your items",
  },
  {
    key: "servicePresentationRating",
    label: "Service & quote clarity",
    helper: "How options and pricing were shown",
  },
];

function StarButton({
  filled,
  onClick,
  label,
}: {
  filled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer text-[1.75rem] leading-none transition-transform hover:scale-110"
      aria-label={label}
    >
      {filled ? "★" : "☆"}
    </button>
  );
}

function StarRow({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-3.5 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-small font-medium text-foreground">{label}</p>
        {helper ? (
          <p className="mt-0.5 text-caption text-muted-foreground">{helper}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 gap-0.5 text-amber-400">
        {Array.from({ length: 5 }, (_, index) => (
          <StarButton
            key={index}
            filled={index < value}
            onClick={() => onChange(index + 1)}
            label={`${label}: ${index + 1} stars`}
          />
        ))}
      </div>
    </div>
  );
}

function StarsDisplay({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-small text-foreground">{label}</span>
      <div
        className="flex gap-0.5 text-[1.35rem] leading-none text-amber-500"
        aria-label={`${label}: ${value} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index}>{index < value ? "★" : "☆"}</span>
        ))}
      </div>
    </div>
  );
}

function hasCompleteRatings(ratings: ExperienceFormRatings): boolean {
  return RATING_ROWS.every(({ key }) => ratings[key] > 0);
}

function isLegacySubmitted(
  ratings: ExperienceFormRatings,
  initialSubmitted: boolean | undefined,
): boolean {
  return (
    Boolean(initialSubmitted) &&
    ratings.driverRating > 0 &&
    ratings.deliveryRating > 0 &&
    !hasCompleteRatings(ratings)
  );
}

export default function DeliveryExperienceSurveyCard({
  initialRatings,
  initialComment,
  initialSubmitted,
  onSubmit,
}: DeliveryExperienceSurveyCardProps) {
  const [ratings, setRatings] = useState<ExperienceFormRatings>({
    driverRating: initialRatings?.driverRating ?? 0,
    platformRating: initialRatings?.platformRating ?? 0,
    deliveryRating: initialRatings?.deliveryRating ?? 0,
    timelinessRating: initialRatings?.timelinessRating ?? 0,
    packageHandlingRating: initialRatings?.packageHandlingRating ?? 0,
    servicePresentationRating: initialRatings?.servicePresentationRating ?? 0,
  });
  const [comment, setComment] = useState(initialComment ?? "");
  const [submitted, setSubmitted] = useState(
    Boolean(
      initialSubmitted ||
      (initialRatings && hasCompleteRatings(initialRatings as ExperienceFormRatings)),
    ),
  );
  const [submitting, setSubmitting] = useState(false);

  const setDimension = (key: keyof ExperienceFormRatings, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  if (submitted) {
    const legacyOnly = isLegacySubmitted(ratings, initialSubmitted);
    const rowsToShow = legacyOnly
      ? RATING_ROWS.filter(
          ({ key }) => key === "driverRating" || key === "deliveryRating",
        )
      : RATING_ROWS;

    return (
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
        <h3 className="text-body font-bold text-foreground">
          Thanks for your feedback!
        </h3>
        <div className="mt-3 divide-y divide-emerald-200/80">
          {rowsToShow.map(({ key, label }) =>
            ratings[key] > 0 ? (
              <StarsDisplay key={key} label={label} value={ratings[key]} />
            ) : null,
          )}
        </div>
        {comment ? (
          <p className="mt-3 text-small text-muted-foreground">
            &ldquo;{comment}&rdquo;
          </p>
        ) : null}
      </section>
    );
  }

  const canSubmit = hasCompleteRatings(ratings);

  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <h3 className="text-body font-bold text-foreground">Rate your delivery</h3>
      <p className="mt-1 text-small text-muted-foreground">
        Your ratings help us improve drivers, the app, and every delivery.
      </p>

      <div className="mt-4">
        {RATING_ROWS.map(({ key, label, helper }) => (
          <StarRow
            key={key}
            label={label}
            helper={helper}
            value={ratings[key]}
            onChange={(value) => setDimension(key, value)}
          />
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Anything else we should know? (optional)"
        rows={3}
        className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />

      <Button
        type="button"
        className="mt-4 h-10 rounded-[6px] px-5 text-small font-semibold"
        disabled={!canSubmit || submitting}
        onClick={() => {
          void (async () => {
            setSubmitting(true);
            try {
              await onSubmit({ ...ratings, comment });
              setSubmitted(true);
            } finally {
              setSubmitting(false);
            }
          })();
        }}
      >
        {submitting ? "Saving…" : "Submit feedback"}
      </Button>
    </section>
  );
}
