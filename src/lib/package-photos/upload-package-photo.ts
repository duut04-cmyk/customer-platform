import { sameOriginFormPost } from "@/api/same-origin-client";
import { ApiError } from "@/api/errors";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export type UploadedPackagePhoto = {
  objectKey: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  fileSizeBytes: number;
  storageProvider: string;
  previewUrl: string;
};

function normalizeMimeType(raw: string): "image/jpeg" | "image/png" | "image/webp" {
  const mime = raw.split(";")[0]?.trim().toLowerCase() ?? "";
  if (mime === "image/jpg") return "image/jpeg";
  if (ALLOWED_MIME_TYPES.has(mime)) {
    return mime as "image/jpeg" | "image/png" | "image/webp";
  }
  throw new ApiError({
    message: "Unsupported photo format. Use JPG, PNG, or WebP.",
    code: "VALIDATION_ERROR",
    status: 400,
  });
}

type UploadSuccess = {
  success: true;
  data: {
    objectKey: string;
    storageProvider: string;
    mimeType: "image/jpeg" | "image/png" | "image/webp";
    fileSizeBytes: number;
  };
};

/** Upload via Next.js server proxy to R2 (no browser → R2 CORS). */
export async function uploadPackagePhotoFile(
  file: File,
  uploadBatchId: string,
): Promise<UploadedPackagePhoto> {
  const mimeType = normalizeMimeType(file.type || "image/jpeg");
  const fileSizeBytes = file.size;

  if (fileSizeBytes <= 0 || fileSizeBytes > MAX_BYTES) {
    throw new ApiError({
      message: "Each package photo must be at most 5MB.",
      code: "VALIDATION_ERROR",
      status: 400,
    });
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("uploadBatchId", uploadBatchId);

  const uploadBody = await sameOriginFormPost<UploadSuccess>(
    "/api/package-photos/upload",
    formData,
  );

  if (!uploadBody.success || !uploadBody.data?.objectKey) {
    throw new ApiError({
      message: "Could not upload package photo to storage.",
      code: "INTERNAL_ERROR",
      status: 500,
    });
  }

  const previewUrl = URL.createObjectURL(file);

  return {
    objectKey: uploadBody.data.objectKey,
    mimeType: uploadBody.data.mimeType ?? mimeType,
    fileSizeBytes: uploadBody.data.fileSizeBytes ?? fileSizeBytes,
    storageProvider: uploadBody.data.storageProvider,
    previewUrl,
  };
}
