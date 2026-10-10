import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCustomerBearer } from "@/server/auth/verify-customer-bearer";
import {
  ALLOWED_PACKAGE_PHOTO_MIME_TYPES,
  PACKAGE_PHOTO_MAX_BYTES,
} from "@/server/object-storage/constants";
import { presignPackagePhotoUpload } from "@/server/object-storage/presign-package-photo";
import { isR2Configured } from "@/server/object-storage/r2-env";

const bodySchema = z.object({
  uploadBatchId: z.string().uuid(),
  mimeType: z.enum(ALLOWED_PACKAGE_PHOTO_MIME_TYPES),
  fileSizeBytes: z.number().int().positive().max(PACKAGE_PHOTO_MAX_BYTES),
});

export async function POST(request: Request) {
  if (!isR2Configured()) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "OBJECT_STORAGE_NOT_CONFIGURED",
          message: "Package photo storage is not configured on the server.",
        },
      },
      { status: 503 },
    );
  }

  const customerId = await verifyCustomerBearer(request.headers.get("authorization"));
  if (!customerId) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required." },
      },
      { status: 401 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid JSON body." },
      },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message ?? "Invalid request.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const data = await presignPackagePhotoUpload({
      customerId,
      uploadBatchId: parsed.data.uploadBatchId,
      mimeType: parsed.data.mimeType,
      fileSizeBytes: parsed.data.fileSizeBytes,
    });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Could not prepare photo upload.",
        },
      },
      { status: 500 },
    );
  }
}
