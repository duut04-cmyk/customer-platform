import { describe, expect, it } from "vitest";
import { ApiError, normalizeApiError } from "./errors";

describe("normalizeApiError", () => {
  it("maps backend error envelope", () => {
    const error = normalizeApiError(401, {
      success: false,
      error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." },
      requestId: "req-1",
    });

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(401);
    expect(error.code).toBe("INVALID_CREDENTIALS");
    expect(error.message).toBe("Invalid email or password.");
    expect(error.requestId).toBe("req-1");
  });

  it("falls back when body is not JSON-shaped", () => {
    const error = normalizeApiError(500, "Server exploded");
    expect(error.message).toBe("Server exploded");
  });
});
