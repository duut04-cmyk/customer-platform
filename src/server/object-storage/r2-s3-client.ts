import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { getR2Credentials, getR2Endpoint, isR2Configured } from "./r2-env";

let s3Client: S3Client | null = null;

export function getR2S3Client(): S3Client {
  if (!isR2Configured()) {
    throw new Error("R2 is not configured");
  }
  if (!s3Client) {
    const { accessKeyId, secretAccessKey } = getR2Credentials();
    s3Client = new S3Client({
      region: "auto",
      endpoint: getR2Endpoint(),
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
  }
  return s3Client;
}
