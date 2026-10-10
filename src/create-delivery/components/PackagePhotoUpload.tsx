"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IconCamera } from "@/dashboard/components/icons";
import { uploadPackagePhotoFile } from "@/lib/package-photos/upload-package-photo";
import {
  MAX_PACKAGE_PHOTOS,
  MIN_PACKAGE_PHOTOS,
  type PackagePhotoUpload as PackagePhotoEntry,
} from "../types";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

function mimeFromFile(file: File): PackagePhotoEntry["mimeType"] {
  const raw = (file.type || "image/jpeg").split(";")[0]?.trim().toLowerCase() ?? "";
  if (raw === "image/jpg") return "image/jpeg";
  if (raw === "image/png") return "image/png";
  if (raw === "image/webp") return "image/webp";
  return "image/jpeg";
}

type PackagePhotoUploadProps = {
  photos: PackagePhotoEntry[];
  uploadBatchId: string;
  onChange: (photos: PackagePhotoEntry[]) => void;
  error?: string;
};

export default function PackagePhotoUpload({
  photos,
  uploadBatchId,
  onChange,
  error,
}: PackagePhotoUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(() => new Set());

  const revokePreview = (photo: PackagePhotoEntry) => {
    if (photo.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(photo.previewUrl);
    }
  };

  const replacePhoto = (id: string, next: PackagePhotoEntry) => {
    onChange(photosRef.current.map((photo) => (photo.id === id ? next : photo)));
  };

  const removePhotoById = (id: string) => {
    const current = photosRef.current;
    const removed = current.find((photo) => photo.id === id);
    if (removed) revokePreview(removed);
    onChange(current.filter((photo) => photo.id !== id));
  };

  const uploadPending = async (entry: PackagePhotoEntry, file: File) => {
    setUploadingIds((prev) => new Set(prev).add(entry.id));
    try {
      const uploaded = await uploadPackagePhotoFile(file, uploadBatchId);
      if (entry.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(entry.previewUrl);
      }
      replacePhoto(entry.id, {
        id: entry.id,
        previewUrl: uploaded.previewUrl,
        mimeType: uploaded.mimeType,
        fileSizeBytes: uploaded.fileSizeBytes,
        objectKey: uploaded.objectKey,
        storageProvider: uploaded.storageProvider,
      });
    } catch {
      setLocalError("Could not upload a photo. Remove it and try again.");
      removePhotoById(entry.id);
    } finally {
      setUploadingIds((prev) => {
        const next = new Set(prev);
        next.delete(entry.id);
        return next;
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length || !uploadBatchId) return;

    const remaining = MAX_PACKAGE_PHOTOS - photosRef.current.length;
    if (remaining <= 0) return;

    setLocalError(null);
    const additions: PackagePhotoEntry[] = [];

    for (const file of Array.from(files).slice(0, remaining)) {
      const mime = mimeFromFile(file);
      if (!ALLOWED_MIME.has(file.type.toLowerCase()) && file.type) {
        setLocalError("Unsupported photo format. Use JPG, PNG, or WebP.");
        continue;
      }
      if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
        setLocalError("Each package photo must be at most 5MB.");
        continue;
      }
      const entry: PackagePhotoEntry = {
        id: crypto.randomUUID(),
        previewUrl: URL.createObjectURL(file),
        mimeType: mime,
        fileSizeBytes: file.size,
        pendingFile: file,
      };
      additions.push(entry);
      void uploadPending(entry, file);
    }

    if (additions.length > 0) {
      onChange([...photosRef.current, ...additions]);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const removed = photos[index];
    if (removed) revokePreview(removed);
    onChange(photos.filter((_, i) => i !== index));
  };

  const photosNeeded = Math.max(0, MIN_PACKAGE_PHOTOS - photos.length);
  const showEmptySlots = photos.length < MIN_PACKAGE_PHOTOS;
  const emptySlotCount = showEmptySlots ? photosNeeded : 0;
  const canAddMore = photos.length < MAX_PACKAGE_PHOTOS;
  const isUploading = uploadingIds.size > 0;

  return (
    <div className="space-y-3">
      <p className="text-caption text-muted-foreground">
        Photos upload as soon as you add them so booking stays fast.
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((photo, index) => {
          const uploading = uploadingIds.has(photo.id) || Boolean(photo.pendingFile);
          return (
            <div
              key={photo.id}
              className="group relative h-28 overflow-hidden rounded-xl border border-border bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.previewUrl}
                alt={`Package photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
                  <span className="rounded-full bg-background px-2 py-1 text-[10px] font-semibold text-foreground">
                    Uploading…
                  </span>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-foreground/80 text-caption font-bold text-background opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={`Remove photo ${index + 1}`}
              >
                ×
              </button>
            </div>
          );
        })}

        {showEmptySlots &&
          Array.from({ length: emptySlotCount }).map((_, slotIndex) => {
            const isFirstSlot = photos.length === 0 && slotIndex === 0;
            return (
              <button
                key={`empty-${slotIndex}`}
                type="button"
                disabled={!uploadBatchId || isUploading}
                onClick={() => inputRef.current?.click()}
                className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-border bg-white px-2 py-2 text-center shadow-sm transition-colors hover:border-foreground/25 hover:bg-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                <IconCamera
                  className={`h-5 w-5 ${isFirstSlot ? "text-blue-600" : "text-muted-foreground/60"}`}
                />
                <span
                  className={`text-caption ${isFirstSlot ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}
                >
                  Add photo
                </span>
                {isFirstSlot ? (
                  <span className="text-[10px] leading-tight text-muted-foreground">
                    JPG, PNG, WebP (max 5MB)
                  </span>
                ) : null}
              </button>
            );
          })}
      </div>

      {photos.length >= MIN_PACKAGE_PHOTOS && canAddMore && (
        <button
          type="button"
          disabled={!uploadBatchId || isUploading}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer text-caption font-semibold text-accent hover:text-accent/80 disabled:cursor-not-allowed disabled:opacity-60"
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

      {(error || localError) && (
        <p className="text-caption text-red-600" role="alert">
          {localError ?? error}
        </p>
      )}
    </div>
  );
}
