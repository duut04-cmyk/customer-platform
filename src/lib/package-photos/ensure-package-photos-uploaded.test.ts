import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PackagePhotoUpload } from "@/create-delivery/types";
import { ensurePackagePhotosUploaded } from "./ensure-package-photos-uploaded";

vi.mock("./upload-package-photo", () => ({
  uploadPackagePhotoFile: vi.fn(async (file: File) => ({
    objectKey: `staging/u/b/photos/${file.name}.jpg`,
    mimeType: "image/jpeg" as const,
    fileSizeBytes: file.size,
    storageProvider: "CLOUDFLARE_R2",
    previewUrl: "blob:uploaded",
  })),
}));

import { uploadPackagePhotoFile } from "./upload-package-photo";

describe("ensurePackagePhotosUploaded", () => {
  beforeEach(() => {
    vi.mocked(uploadPackagePhotoFile).mockReset();
    vi.mocked(uploadPackagePhotoFile).mockImplementation(async (file: File) => ({
      objectKey: `staging/u/b/photos/${file.name}.jpg`,
      mimeType: "image/jpeg" as const,
      fileSizeBytes: file.size,
      storageProvider: "CLOUDFLARE_R2",
      previewUrl: "blob:uploaded",
    }));
  });

  it("skips photos that already have object keys", async () => {
    const photos: PackagePhotoUpload[] = [
      {
        id: "1",
        previewUrl: "blob:a",
        mimeType: "image/jpeg",
        fileSizeBytes: 10,
        objectKey: "staging/c/b/photos/x.jpg",
        storageProvider: "CLOUDFLARE_R2",
      },
    ];
    const result = await ensurePackagePhotosUploaded(
      photos,
      "11111111-1111-4111-8111-111111111111",
    );
    expect(result).toHaveLength(1);
    expect(uploadPackagePhotoFile).not.toHaveBeenCalled();
  });

  it("uploads pending files", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "pic.jpg", {
      type: "image/jpeg",
    });
    const photos: PackagePhotoUpload[] = [
      {
        id: "2",
        previewUrl: "blob:b",
        mimeType: "image/jpeg",
        fileSizeBytes: 3,
        pendingFile: file,
      },
    ];
    const result = await ensurePackagePhotosUploaded(
      photos,
      "11111111-1111-4111-8111-111111111111",
    );
    expect(uploadPackagePhotoFile).toHaveBeenCalledWith(
      file,
      "11111111-1111-4111-8111-111111111111",
    );
    expect(result[0]?.objectKey).toContain("pic.jpg");
  });

  it("uploads multiple pending files in parallel while preserving order", async () => {
    const callOrder: string[] = [];
    vi.mocked(uploadPackagePhotoFile).mockImplementation(async (file: File) => {
      callOrder.push(`start:${file.name}`);
      await new Promise((resolve) => setTimeout(resolve, 5));
      callOrder.push(`end:${file.name}`);
      return {
        objectKey: `staging/u/b/photos/${file.name}.jpg`,
        mimeType: "image/jpeg" as const,
        fileSizeBytes: file.size,
        storageProvider: "CLOUDFLARE_R2",
        previewUrl: "blob:uploaded",
      };
    });

    const mk = (name: string) =>
      new File([new Uint8Array([1])], name, { type: "image/jpeg" });

    const photos: PackagePhotoUpload[] = [
      {
        id: "a",
        previewUrl: "blob:1",
        mimeType: "image/jpeg",
        fileSizeBytes: 1,
        pendingFile: mk("first.jpg"),
      },
      {
        id: "b",
        previewUrl: "blob:2",
        mimeType: "image/jpeg",
        fileSizeBytes: 1,
        pendingFile: mk("second.jpg"),
      },
    ];

    const result = await ensurePackagePhotosUploaded(
      photos,
      "11111111-1111-4111-8111-111111111111",
    );

    expect(result.map((p) => p.id)).toEqual(["a", "b"]);
    expect(callOrder.filter((e) => e.startsWith("start:"))).toHaveLength(2);
    expect(uploadPackagePhotoFile).toHaveBeenCalledTimes(2);
  });
});
