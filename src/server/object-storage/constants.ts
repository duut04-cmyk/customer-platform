export const OBJECT_STORAGE_PROVIDER = "CLOUDFLARE_R2";

export const ALLOWED_PACKAGE_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedPackagePhotoMimeType =
  (typeof ALLOWED_PACKAGE_PHOTO_MIME_TYPES)[number];

export const PACKAGE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export function stagingPhotosPrefix(customerId: string, uploadBatchId: string): string {
  return `staging/${customerId}/${uploadBatchId}/photos`;
}

export function mimeTypeToExtension(mimeType: AllowedPackagePhotoMimeType): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
  }
}
