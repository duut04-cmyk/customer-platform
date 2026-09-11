"use client";

import { useState } from "react";
import Button from "@/common/components/Button";
import Modal from "@/common/components/Modal";
import { CANCEL_DELIVERY_REASONS, type CancelDeliveryReason } from "../../customerCopy";

type CancelDeliveryModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function CancelDeliveryModal({
  open,
  onClose,
  onConfirm,
}: CancelDeliveryModalProps) {
  const [selectedReason, setSelectedReason] = useState<CancelDeliveryReason | "">("");
  const [otherReason, setOtherReason] = useState("");

  const handleConfirm = () => {
    const reason =
      selectedReason === "Other" ? otherReason.trim() || "Other" : selectedReason;
    if (!reason) return;
    onConfirm(reason);
    setSelectedReason("");
    setOtherReason("");
  };

  const handleClose = () => {
    setSelectedReason("");
    setOtherReason("");
    onClose();
  };

  const canConfirm =
    selectedReason !== "" &&
    (selectedReason !== "Other" || otherReason.trim().length > 0);

  return (
    <Modal open={open} onClose={handleClose} className="max-w-md !p-0">
      <div className="p-6">
        <h2 className="text-body-lg font-bold text-foreground">Cancel delivery?</h2>
        <p className="mt-2 text-small text-muted-foreground">
          You can cancel before pickup. Please tell us why so we can improve your
          experience.
        </p>

        <fieldset className="mt-5 space-y-2">
          <legend className="sr-only">Cancellation reason</legend>
          {CANCEL_DELIVERY_REASONS.map((reason) => (
            <label
              key={reason}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                selectedReason === reason
                  ? "border-accent bg-accent/5"
                  : "border-border hover:bg-surface/50"
              }`}
            >
              <input
                type="radio"
                name="cancel-reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="accent-accent"
              />
              <span className="text-small text-foreground">{reason}</span>
            </label>
          ))}
        </fieldset>

        {selectedReason === "Other" && (
          <textarea
            value={otherReason}
            onChange={(event) => setOtherReason(event.target.value)}
            placeholder="Tell us more…"
            rows={3}
            className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="h-10 rounded-[6px] px-5 text-small font-semibold"
            onClick={handleClose}
          >
            Keep delivery
          </Button>
          <Button
            type="button"
            className="h-10 rounded-[6px] bg-red-600 px-5 text-small font-semibold hover:bg-red-700"
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            Cancel delivery
          </Button>
        </div>
      </div>
    </Modal>
  );
}
