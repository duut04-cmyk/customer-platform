const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let scriptLoadPromise: Promise<void> | null = null;
let initializedClientId: string | null = null;
let credentialHandler: ((credential: string) => void) | null = null;

export type GoogleCredentialHandler = (credential: string) => void;

export function getGoogleClientIdFromEnv(): string | null {
  const value = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  return value || null;
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

export async function initializeGoogleIdentity(input: {
  clientId: string;
  onCredential: GoogleCredentialHandler;
}): Promise<void> {
  credentialHandler = input.onCredential;
  await loadGoogleIdentityScript();

  if (!window.google?.accounts?.id) {
    throw new Error("Google Identity Services is unavailable.");
  }

  if (initializedClientId === input.clientId) {
    return;
  }

  window.google.accounts.id.initialize({
    client_id: input.clientId,
    callback: (response) => {
      const credential = response.credential?.trim();
      if (credential) {
        credentialHandler?.(credential);
      }
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  initializedClientId = input.clientId;
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

  container.replaceChildren();

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
  credentialHandler = null;
}
