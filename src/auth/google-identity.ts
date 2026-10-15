const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let scriptLoadPromise: Promise<void> | null = null;
let initializedClientId: string | null = null;
const credentialListeners = new Set<(credential: string) => void>();

export type GoogleCredentialHandler = (credential: string) => void;

export function getGoogleClientIdFromEnv(): string | null {
  const value = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  return value || null;
}

function dispatchGoogleCredential(credential: string): void {
  for (const listener of credentialListeners) {
    listener(credential);
  }
}

/** Register a handler for GIS ID tokens. Returns an unsubscribe function. */
export function subscribeGoogleCredential(
  handler: GoogleCredentialHandler,
): () => void {
  credentialListeners.add(handler);
  return () => {
    credentialListeners.delete(handler);
  };
}

export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Identity Services requires a browser."));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SCRIPT_SRC}"]`,
    );

    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Identity Services.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error("Failed to load Google Identity Services."));
    };
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/** Load GIS and call `initialize` once per client id (safe to call repeatedly). */
export async function ensureGoogleIdentityInitialized(clientId: string): Promise<void> {
  await loadGoogleIdentityScript();

  if (!window.google?.accounts?.id) {
    throw new Error("Google Identity Services is unavailable.");
  }

  if (initializedClientId === clientId) {
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      const credential = response.credential?.trim();
      if (credential) {
        dispatchGoogleCredential(credential);
      }
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  initializedClientId = clientId;
}

/**
 * Preload GIS when a client id is configured (e.g. from AuthProvider).
 * Authorized JavaScript origin must include the app origin (e.g. http://localhost:3000).
 */
const GSI_PARK_ELEMENT_ID = "doot-google-signin-park";
const DEFAULT_GSI_BUTTON_WIDTH = 400;

let globalSignInHost: HTMLDivElement | null = null;

function getGoogleSignInParkingLot(): HTMLElement {
  if (typeof document === "undefined") {
    throw new Error("Google Identity Services requires a browser.");
  }

  let park = document.getElementById(GSI_PARK_ELEMENT_ID);
  if (!park) {
    park = document.createElement("div");
    park.id = GSI_PARK_ELEMENT_ID;
    park.setAttribute("aria-hidden", "true");
    park.style.cssText =
      "position:fixed;left:-9999px;top:0;width:400px;height:48px;overflow:hidden;opacity:0;pointer-events:none;";
    document.body.appendChild(park);
  }
  return park;
}

function getGlobalGoogleSignInHost(): HTMLDivElement {
  if (!globalSignInHost) {
    globalSignInHost = document.createElement("div");
    globalSignInHost.dataset.dootGsiHost = "true";
    globalSignInHost.style.width = "100%";
    globalSignInHost.style.height = "100%";
  }
  return globalSignInHost;
}

/** Park the shared GIS iframe so modal unmount does not destroy or reload it. */
export function detachGlobalGoogleSignInHostToPark(): void {
  if (!globalSignInHost) {
    return;
  }
  getGoogleSignInParkingLot().appendChild(globalSignInHost);
}

/**
 * Ensures the single shared GIS button exists (one iframe / one gsi/button load per width).
 * Authorized JavaScript origin must include the app origin (e.g. http://localhost:3000).
 */
export async function ensureGlobalGoogleSignInButton(
  clientId: string,
  width = DEFAULT_GSI_BUTTON_WIDTH,
): Promise<void> {
  await ensureGoogleIdentityInitialized(clientId);
  const host = getGlobalGoogleSignInHost();
  if (!host.parentElement) {
    getGoogleSignInParkingLot().appendChild(host);
  }
  renderGoogleSignInButton(host, { width: Math.max(width, 320) });
}

/** Mount the shared GIS button into a visible overlay (login/signup modal). */
export async function attachGlobalGoogleSignInHost(
  container: HTMLElement,
  width: number,
  clientId: string,
): Promise<void> {
  await ensureGlobalGoogleSignInButton(clientId, width);
  const host = getGlobalGoogleSignInHost();
  if (host.parentElement !== container) {
    container.appendChild(host);
  }
}

export function preloadGoogleIdentityFromEnv(): void {
  const clientId = getGoogleClientIdFromEnv();
  if (!clientId) {
    return;
  }
  void ensureGoogleIdentityInitialized(clientId).catch(() => {
    // GoogleButton surfaces load errors when the modal mounts.
  });
}

/** @deprecated Prefer ensureGoogleIdentityInitialized + subscribeGoogleCredential. */
export async function initializeGoogleIdentity(input: {
  clientId: string;
  onCredential: GoogleCredentialHandler;
}): Promise<void> {
  subscribeGoogleCredential(input.onCredential);
  await ensureGoogleIdentityInitialized(input.clientId);
}

export function renderGoogleSignInButton(
  container: HTMLElement,
  options?: {
    width?: number;
    theme?: "outline" | "filled_blue" | "filled_black";
    size?: "large" | "medium" | "small";
  },
): void {
  if (!window.google?.accounts?.id) {
    throw new Error("Google Identity Services is unavailable.");
  }

  const widthKey = String(options?.width ?? "");
  if (
    container.dataset.gsiButtonWidth === widthKey &&
    container.querySelector("iframe")
  ) {
    return;
  }

  container.replaceChildren();
  container.dataset.gsiButtonWidth = widthKey;

  window.google.accounts.id.renderButton(container, {
    type: "standard",
    theme: options?.theme ?? "outline",
    size: options?.size ?? "large",
    text: "continue_with",
    width: options?.width,
    logo_alignment: "left",
  });
}

/** @internal Resets module state for tests. */
export function resetGoogleIdentityForTests(): void {
  scriptLoadPromise = null;
  initializedClientId = null;
  credentialListeners.clear();
  globalSignInHost?.remove();
  globalSignInHost = null;
  document.getElementById(GSI_PARK_ELEMENT_ID)?.remove();
}
