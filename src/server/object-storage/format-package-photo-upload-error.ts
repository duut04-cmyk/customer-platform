import "server-only";

type FormattedUploadError = {
  status: number;
  code: string;
  message: string;
  log: string;
};

function errorNameAndMessage(error: unknown): { name: string; message: string } {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return { name: "Error", message: String(error) };
}

/** Maps R2/S3 SDK failures to safe client messages; full detail goes to server logs. */
export function formatPackagePhotoUploadError(error: unknown): FormattedUploadError {
  const { name, message } = errorNameAndMessage(error);
  const lower = message.toLowerCase();

  if (
    name === "TimeoutError" ||
    lower.includes("timeout") ||
    lower.includes("timed out")
  ) {
    return {
      status: 504,
      code: "OBJECT_STORAGE_TIMEOUT",
      message:
        "Photo upload timed out. Check R2 credentials and network access, then try again.",
      log: `${name}: ${message}`,
    };
  }

  if (
    lower.includes("accessdenied") ||
    lower.includes("access denied") ||
    lower.includes("invalidaccesskeyid") ||
    lower.includes("signaturedoesnotmatch")
  ) {
    return {
      status: 503,
      code: "OBJECT_STORAGE_ACCESS_DENIED",
      message:
        "Photo storage rejected the upload. Verify R2 API token permissions and credentials in .env.local.",
      log: `${name}: ${message}`,
    };
  }

  if (lower.includes("nosuchbucket") || lower.includes("bucket not found")) {
    return {
      status: 503,
      code: "OBJECT_STORAGE_BUCKET_NOT_FOUND",
      message:
        "Photo storage bucket was not found. Check R2_BUCKET_NAME and create the bucket in Cloudflare.",
      log: `${name}: ${message}`,
    };
  }

  if (lower.includes("enotfound") || lower.includes("getaddrinfo")) {
    return {
      status: 503,
      code: "OBJECT_STORAGE_UNREACHABLE",
      message:
        "Could not reach photo storage. Check R2_ACCOUNT_ID and network connectivity.",
      log: `${name}: ${message}`,
    };
  }

  const isDev = process.env.NODE_ENV === "development";
  return {
    status: 500,
    code: "INTERNAL_ERROR",
    message: isDev
      ? `Could not upload package photo to storage. (${name}: ${message})`
      : "Could not upload package photo to storage.",
    log: `${name}: ${message}`,
  };
}
