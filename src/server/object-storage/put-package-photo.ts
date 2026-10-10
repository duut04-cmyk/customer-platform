import "server-only";

import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  mimeTypeToExtension,
  OBJECT_STORAGE_PROVIDER,
  PACKAGE_PHOTO_MAX_BYTES,
  stagingPhotosPrefix,
  type AllowedPackagePhotoMimeType,
} from "./constants";
import { getR2BucketName } from "./r2-env";
import { getR2S3Client } from "./r2-s3-client";

export type PutPackagePhotoInput = {
  customerId: string;
  uploadBatchId: string;
  mimeType: AllowedPackagePhotoMimeType;
  body: Uint8Array;
};

export function buildPackagePhotoObjectKey(input: {
  customerId: string;
  uploadBatchId: string;
  mimeType: AllowedPackagePhotoMimeType;
}): string {
  const ext = mimeTypeToExtension(input.mimeType);
  return `${stagingPhotosPrefix(input.customerId, input.uploadBatchId)}/${randomUUID()}.${ext}`;
}

/** Server-side upload to R2 (avoids browser CORS to cloudflarestorage.com). */
export async function putPackagePhotoToR2(input: PutPackagePhotoInput) {
  if (input.body.byteLength <= 0 || input.body.byteLength > PACKAGE_PHOTO_MAX_BYTES) {
    throw new Error("Invalid package photo file size");
  }

  const objectKey = buildPackagePhotoObjectKey({
    customerId: input.customerId,
    uploadBatchId: input.uploadBatchId,
    mimeType: input.mimeType,
  });

  const client = getR2S3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: objectKey,
      Body: input.body,
      ContentType: input.mimeType,
      ContentLength: input.body.byteLength,
    }),
  );

  return {
    objectKey,
    storageProvider: OBJECT_STORAGE_PROVIDER,
    mimeType: input.mimeType,
    fileSizeBytes: input.body.byteLength,
  };
}
