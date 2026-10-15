/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  attachGlobalGoogleSignInHost,
  detachGlobalGoogleSignInHostToPark,
  ensureGoogleIdentityInitialized,
  getGoogleClientIdFromEnv,
  loadGoogleIdentityScript,
  resetGoogleIdentityForTests,
  subscribeGoogleCredential,
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

  it("initializes GIS once and forwards credentials to subscribers", async () => {
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

    subscribeGoogleCredential(onCredential);

    await ensureGoogleIdentityInitialized("client-id-123");
    await ensureGoogleIdentityInitialized("client-id-123");

    expect(initialize).toHaveBeenCalledOnce();
    const config = initialize.mock.calls[0]?.[0];
    expect(config?.client_id).toBe("client-id-123");

    config?.callback({ credential: " google-id-token " });
    expect(onCredential).toHaveBeenCalledWith("google-id-token");
  });

  it("reuses one global GIS host when attaching and detaching overlays", async () => {
    const renderButton = vi.fn((parent: HTMLElement) => {
      const iframe = document.createElement("iframe");
      iframe.title = "Google Sign-In";
      parent.appendChild(iframe);
    });
    window.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton,
          prompt: vi.fn(),
          disableAutoSelect: vi.fn(),
        },
      },
    };

    const overlay = document.createElement("div");
    document.body.appendChild(overlay);

    await attachGlobalGoogleSignInHost(overlay, 360, "client-id-123");
    const iframeAfterFirstAttach = overlay.querySelector("iframe");

    detachGlobalGoogleSignInHostToPark();
    expect(overlay.querySelector("iframe")).toBeNull();

    await attachGlobalGoogleSignInHost(overlay, 360, "client-id-123");
    expect(overlay.querySelector("iframe")).toBe(iframeAfterFirstAttach);
    expect(renderButton).toHaveBeenCalledOnce();

    overlay.remove();
  });
});
