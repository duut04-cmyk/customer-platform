import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { buildPackagePhotoObjectKey } from "./put-package-photo";

describe("buildPackagePhotoObjectKey", () => {
  it("uses staging prefix with customer and batch ids", () => {
    const key = buildPackagePhotoObjectKey({
      customerId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      uploadBatchId: "11111111-2222-4333-8444-555555555555",
      mimeType: "image/jpeg",
    });
    expect(key).toMatch(
      /^staging\/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee\/11111111-2222-4333-8444-555555555555\/photos\/[0-9a-f-]{36}\.jpg$/i,
    );
  });
});
