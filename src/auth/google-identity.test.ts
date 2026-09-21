/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getGoogleClientIdFromEnv,
  initializeGoogleIdentity,
  loadGoogleIdentityScript,
  resetGoogleIdentityForTests,
} from "./google-identity";

describe("google-identity", () => {
  beforeEach(() => {
    resetGoogleIdentityForTests();
    vi.unstubAllEnvs();
    document.head.innerHTML = "";
    delete window.google;
  });

  afterEach(() => {
    resetGoogleIdentityForTests();
    vi.unstubAllEnvs();
  });

  it("reads the public Google client id from env", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "  client-id-123  ");
    expect(getGoogleClientIdFromEnv()).toBe("client-id-123");
  });

  it("resolves immediately when GIS is already loaded", async () => {
    window.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn(),
          prompt: vi.fn(),
          disableAutoSelect: vi.fn(),
        },
      },
    };

    await expect(loadGoogleIdentityScript()).resolves.toBeUndefined();
    expect(document.querySelector("script")).toBeNull();
  });

  it("initializes GIS once and forwards credentials to the handler", async () => {
    const initialize = vi.fn();
    const onCredential = vi.fn();

    window.google = {
      accounts: {
        id: {
          initialize,
          renderButton: vi.fn(),
          prompt: vi.fn(),
          disableAutoSelect: vi.fn(),
        },
      },
    };

    await initializeGoogleIdentity({
      clientId: "client-id-123",
      onCredential,
    });

    expect(initialize).toHaveBeenCalledOnce();
    const config = initialize.mock.calls[0]?.[0];
    expect(config?.client_id).toBe("client-id-123");

    config?.callback({ credential: " google-id-token " });
    expect(onCredential).toHaveBeenCalledWith("google-id-token");
  });
});
