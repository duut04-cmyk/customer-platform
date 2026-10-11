import { describe, expect, it } from "vitest";
import {
  formatWeight,
  initialDeliveryFormData,
  resolvePackageWeightKg,
  validatePackageFields,
  type PackagePhotoUpload,
} from "./types";

function pendingPhoto(id: string): PackagePhotoUpload {
  return {
    id,
    previewUrl: "blob:test",
    mimeType: "image/jpeg",
    fileSizeBytes: 100,
    pendingFile: new File([new Uint8Array([1])], `${id}.jpg`, {
      type: "image/jpeg",
    }),
  };
}

describe("validatePackageFields (deferred photo upload)", () => {
  it("accepts photos with pendingFile and no objectKey", () => {
    const errors = validatePackageFields({
      ...initialDeliveryFormData,
      packageType: "food",
      packageSizeTier: "small",
      packagePhotos: [pendingPhoto("1"), pendingPhoto("2"), pendingPhoto("3")],
      weight: "1",
    });
    expect(errors.packagePhotos).toBeUndefined();
  });

  it("rejects photos missing both pendingFile and objectKey", () => {
    const errors = validatePackageFields({
      ...initialDeliveryFormData,
      packageType: "food",
      packageSizeTier: "small",
      packagePhotos: [
        pendingPhoto("1"),
        pendingPhoto("2"),
        {
          id: "bad",
          previewUrl: "blob:x",
          mimeType: "image/jpeg",
          fileSizeBytes: 1,
        },
      ],
      weight: "1",
    });
    expect(errors.packagePhotos).toMatch(/invalid/i);
  });
});

describe("package weight defaults by size tier", () => {
  const photos = [pendingPhoto("1"), pendingPhoto("2"), pendingPhoto("3")];

  it("uses small tier max when weight is empty", () => {
    const data = {
      ...initialDeliveryFormData,
      packageType: "food" as const,
      packageSizeTier: "small" as const,
      packagePhotos: photos,
      weight: "",
    };
    expect(resolvePackageWeightKg(data)).toBe(0.5);
    expect(formatWeight(data)).toBe("0.5 kg (estimated)");
    expect(validatePackageFields(data).weight).toBeUndefined();
  });

  it("uses medium tier max when weight is empty", () => {
    const data = {
      ...initialDeliveryFormData,
      packageType: "food" as const,
      packageSizeTier: "medium" as const,
      packagePhotos: photos,
      weight: "",
    };
    expect(resolvePackageWeightKg(data)).toBe(2.5);
    expect(formatWeight(data)).toBe("2.5 kg (estimated)");
    expect(validatePackageFields(data).weight).toBeUndefined();
  });

  it("requires weight for large tier", () => {
    const data = {
      ...initialDeliveryFormData,
      packageType: "food" as const,
      packageSizeTier: "large" as const,
      packagePhotos: photos,
      length: "40",
      width: "30",
      height: "20",
      weight: "",
    };
    expect(validatePackageFields(data).weight).toMatch(/required/i);
  });
});
