"use client";

import { useState } from "react";
import Button from "@/common/components/Button";

type DeliveryRatingCardProps = {
  initialRating?: number;
  initialComment?: string;
  onSubmit: (rating: number, comment: string) => void;
};

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
      className="cursor-pointer text-2xl transition-transform hover:scale-110"
      aria-label={label}
    >
      {filled ? "★" : "☆"}
    </button>
  );
}

export default function DeliveryRatingCard({
  initialRating,
  initialComment,
  onSubmit,
}: DeliveryRatingCardProps) {
  const [rating, setRating] = useState(initialRating ?? 0);
  const [comment, setComment] = useState(initialComment ?? "");
  const [submitted, setSubmitted] = useState(Boolean(initialRating));

  if (submitted && rating > 0) {
    return (
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
        <h3 className="text-body font-bold text-foreground">
          Thanks for your feedback!
        </h3>
        <div
          className="mt-2 flex items-center gap-1 text-amber-500"
          aria-label={`${rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index}>{index < rating ? "★" : "☆"}</span>
          ))}
        </div>
        {comment && (
          <p className="mt-2 text-small text-muted-foreground">
            &ldquo;{comment}&rdquo;
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <h3 className="text-body font-bold text-foreground">Rate your delivery</h3>
      <p className="mt-1 text-small text-muted-foreground">
        How was your experience with this delivery?
      </p>

      <div className="mt-4 flex gap-1 text-amber-400">
        {Array.from({ length: 5 }, (_, index) => (
          <StarButton
            key={index}
            filled={index < rating}
            onClick={() => setRating(index + 1)}
            label={`Rate ${index + 1} stars`}
          />
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Share optional feedback…"
        rows={3}
        className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />

      <Button
        type="button"
        className="mt-4 h-10 rounded-[6px] px-5 text-small font-semibold"
        disabled={rating === 0}
        onClick={() => {
          onSubmit(rating, comment);
          setSubmitted(true);
        }}
      >
        Submit rating
      </Button>
    </section>
  );
}
