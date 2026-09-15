export type ApiErrorBody = {
  success?: false;
  error?: {
    code?: string;
    message?: string;
  };
  requestId?: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(input: {
    status: number;
    message: string;
    code?: string;
    requestId?: string;
    details?: unknown;
  }) {
    super(input.message);
    this.name = "ApiError";
    this.status = input.status;
    this.code = input.code;
    this.requestId = input.requestId;
    this.details = input.details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function normalizeApiError(
  status: number,
  body: unknown,
  fallbackMessage = "Request failed.",
): ApiError {
  if (body && typeof body === "object") {
    const parsed = body as ApiErrorBody;
    const message =
      typeof parsed.error?.message === "string" && parsed.error.message.trim()
        ? parsed.error.message
        : fallbackMessage;
    return new ApiError({
      status,
      message,
      code: typeof parsed.error?.code === "string" ? parsed.error.code : undefined,
      requestId: typeof parsed.requestId === "string" ? parsed.requestId : undefined,
      details: body,
    });
  }

  if (typeof body === "string" && body.trim()) {
    return new ApiError({ status, message: body.trim() });
  }

  return new ApiError({ status, message: fallbackMessage });
}
