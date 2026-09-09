"use client";

import { useId, useRef } from "react";
import { IconCamera } from "@/dashboard/components/icons";
import { MIN_PACKAGE_PHOTOS } from "../types";

type PackagePhotoUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
};

export default function PackagePhotoUpload({
  value,
  onChange,
  error,
}: PackagePhotoUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const revokeBlobUrl = (url: string) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const newUrls = [...value];
    for (const file of Array.from(files)) {
      newUrls.push(URL.createObjectURL(file));
    }
    onChange(newUrls);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const removed = value[index];
    if (removed) revokeBlobUrl(removed);
    onChange(value.filter((_, i) => i !== index));
  };

  const photosNeeded = Math.max(0, MIN_PACKAGE_PHOTOS - value.length);
  const canAddMore = value.length < MIN_PACKAGE_PHOTOS;
  const emptySlotCount = canAddMore ? photosNeeded : 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative h-28 overflow-hidden rounded-xl border border-border bg-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Package photo ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-foreground/80 text-caption font-bold text-background opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              aria-label={`Remove photo ${index + 1}`}
            >
              ×
            </button>
          </div>
        ))}

        {canAddMore &&
          Array.from({ length: emptySlotCount }).map((_, slotIndex) => {
            const isFirstSlot = value.length === 0 && slotIndex === 0;
            return (
              <button
                key={`empty-${slotIndex}`}
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-border bg-white px-2 py-2 text-center shadow-sm transition-colors hover:border-foreground/25 hover:bg-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <IconCamera
                  className={`h-5 w-5 ${isFirstSlot ? "text-blue-600" : "text-muted-foreground/60"}`}
                />
                <span
                  className={`text-caption ${isFirstSlot ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}
                >
                  {isFirstSlot ? "Upload photo" : "Add photo"}
                </span>
                {isFirstSlot ? (
                  <span className="text-[10px] leading-tight text-muted-foreground">
                    JPG, PNG (max 5MB)
                  </span>
                ) : null}
              </button>
            );
          })}
      </div>

      {value.length >= MIN_PACKAGE_PHOTOS && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer text-caption font-semibold text-accent hover:text-accent/80"
        >
          Add another photo
        </button>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        multiple
        className="sr-only"
        onChange={handleFileChange}
      />

      {error && (
        <p className="text-caption text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
