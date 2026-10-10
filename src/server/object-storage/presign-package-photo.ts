import "server-only";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  OBJECT_STORAGE_PROVIDER,
  PACKAGE_PHOTO_MAX_BYTES,
  type AllowedPackagePhotoMimeType,
} from "./constants";
import { getR2BucketName } from "./r2-env";
import { buildPackagePhotoObjectKey } from "./put-package-photo";
import { getR2S3Client } from "./r2-s3-client";

const PRESIGNED_UPLOAD_EXPIRY_SECONDS = 900;

export type PresignPackagePhotoInput = {
  customerId: string;
  uploadBatchId: string;
  mimeType: AllowedPackagePhotoMimeType;
  fileSizeBytes: number;
};

export async function presignPackagePhotoUpload(input: PresignPackagePhotoInput) {
  if (input.fileSizeBytes <= 0 || input.fileSizeBytes > PACKAGE_PHOTO_MAX_BYTES) {
    throw new Error("Invalid package photo file size");
  }

  const objectKey = buildPackagePhotoObjectKey({
    customerId: input.customerId,
    uploadBatchId: input.uploadBatchId,
    mimeType: input.mimeType,
  });

  const client = getR2S3Client();
  const command = new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: objectKey,
    ContentType: input.mimeType,
    ContentLength: input.fileSizeBytes,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: PRESIGNED_UPLOAD_EXPIRY_SECONDS,
  });

  return {
    uploadUrl,
    objectKey,
    storageProvider: OBJECT_STORAGE_PROVIDER,
  };
}
