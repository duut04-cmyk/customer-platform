import "server-only";

const emptyToUndefined = (value: string | undefined) =>
  value?.trim() === "" ? undefined : value?.trim();

export function isR2Configured(): boolean {
  return Boolean(
    emptyToUndefined(process.env.R2_ACCOUNT_ID) &&
    emptyToUndefined(process.env.R2_ACCESS_KEY_ID) &&
    emptyToUndefined(process.env.R2_SECRET_ACCESS_KEY),
  );
}

export function getR2BucketName(): string {
  return emptyToUndefined(process.env.R2_BUCKET_NAME) ?? "doot";
}

export function getR2Endpoint(): string {
  const accountId = emptyToUndefined(process.env.R2_ACCOUNT_ID);
  if (!accountId) {
    throw new Error("R2_ACCOUNT_ID is not configured");
  }
  return `https://${accountId}.r2.cloudflarestorage.com`;
}

export function getR2Credentials(): { accessKeyId: string; secretAccessKey: string } {
  const accessKeyId = emptyToUndefined(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = emptyToUndefined(process.env.R2_SECRET_ACCESS_KEY);
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("R2 access credentials are not configured");
  }
  return { accessKeyId, secretAccessKey };
}
