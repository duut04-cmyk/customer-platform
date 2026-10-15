import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { formatPackagePhotoUploadError } from "./format-package-photo-upload-error";

describe("formatPackagePhotoUploadError", () => {
  it("maps access denied to OBJECT_STORAGE_ACCESS_DENIED", () => {
    const formatted = formatPackagePhotoUploadError(
      new Error("AccessDenied: Access Denied"),
    );
    expect(formatted.code).toBe("OBJECT_STORAGE_ACCESS_DENIED");
    expect(formatted.status).toBe(503);
    expect(formatted.message).toContain("R2 API token");
  });

  it("maps missing bucket to OBJECT_STORAGE_BUCKET_NOT_FOUND", () => {
    const formatted = formatPackagePhotoUploadError(
      new Error("NoSuchBucket: The specified bucket does not exist"),
    );
    expect(formatted.code).toBe("OBJECT_STORAGE_BUCKET_NOT_FOUND");
    expect(formatted.message).toContain("R2_BUCKET_NAME");
  });

  it("includes SDK message in development for unknown errors", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const formatted = formatPackagePhotoUploadError(new Error("Something unexpected"));
    process.env.NODE_ENV = prev;
    expect(formatted.message).toContain("Something unexpected");
  });
});
