import { ApiError } from "@/api/errors";
import type { PackagePhotoUpload } from "@/create-delivery/types";
import { uploadPackagePhotoFile } from "./upload-package-photo";

/** Upload any photos still pending locally; skip rows that already have R2 keys. */
export async function ensurePackagePhotosUploaded(
  photos: PackagePhotoUpload[],
  uploadBatchId: string,
): Promise<PackagePhotoUpload[]> {
  if (!uploadBatchId.trim()) {
    throw new ApiError({
      status: 422,
      message: "Photo upload session is not ready.",
      code: "VALIDATION_ERROR",
    });
  }

  return Promise.all(
    photos.map(async (photo) => {
      if (photo.objectKey && photo.storageProvider) {
        return photo;
      }

      if (!photo.pendingFile) {
        throw new ApiError({
          status: 422,
          message: "A package photo could not be uploaded. Remove it and add again.",
          code: "VALIDATION_ERROR",
        });
      }

      const uploaded = await uploadPackagePhotoFile(photo.pendingFile, uploadBatchId);

      if (photo.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photo.previewUrl);
      }

      return {
        id: photo.id,
        previewUrl: uploaded.previewUrl,
        mimeType: uploaded.mimeType,
        fileSizeBytes: uploaded.fileSizeBytes,
        objectKey: uploaded.objectKey,
        storageProvider: uploaded.storageProvider,
      };
    }),
  );
}
