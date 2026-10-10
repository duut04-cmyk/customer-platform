import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCustomerBearer } from "@/server/auth/verify-customer-bearer";
import {
  ALLOWED_PACKAGE_PHOTO_MIME_TYPES,
  PACKAGE_PHOTO_MAX_BYTES,
  type AllowedPackagePhotoMimeType,
} from "@/server/object-storage/constants";
import { putPackagePhotoToR2 } from "@/server/object-storage/put-package-photo";
import { isR2Configured } from "@/server/object-storage/r2-env";

const uploadBatchIdSchema = z.string().uuid();

function normalizeMimeType(raw: string): AllowedPackagePhotoMimeType | null {
  const mime = raw.split(";")[0]?.trim().toLowerCase() ?? "";
  if (mime === "image/jpg") return "image/jpeg";
  if ((ALLOWED_PACKAGE_PHOTO_MIME_TYPES as readonly string[]).includes(mime)) {
    return mime as AllowedPackagePhotoMimeType;
  }
  return null;
}

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

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid multipart body." },
      },
      { status: 400 },
    );
  }

  const uploadBatchIdRaw = formData.get("uploadBatchId");
  const fileEntry = formData.get("file");

  const batchParsed = uploadBatchIdSchema.safeParse(
    typeof uploadBatchIdRaw === "string" ? uploadBatchIdRaw : "",
  );
  if (!batchParsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid uploadBatchId." },
      },
      { status: 400 },
    );
  }

  if (!(fileEntry instanceof File)) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Missing package photo file." },
      },
      { status: 400 },
    );
  }

  const mimeType = normalizeMimeType(fileEntry.type || "image/jpeg");
  if (!mimeType) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Unsupported photo format. Use JPG, PNG, or WebP.",
        },
      },
      { status: 400 },
    );
  }

  if (fileEntry.size <= 0 || fileEntry.size > PACKAGE_PHOTO_MAX_BYTES) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Each package photo must be at most 5MB.",
        },
      },
      { status: 400 },
    );
  }

  const buffer = new Uint8Array(await fileEntry.arrayBuffer());

  try {
    const data = await putPackagePhotoToR2({
      customerId,
      uploadBatchId: batchParsed.data,
      mimeType,
      body: buffer,
    });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Could not upload package photo to storage.",
        },
      },
      { status: 500 },
    );
  }
}
