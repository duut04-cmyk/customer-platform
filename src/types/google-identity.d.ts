/** Minimal Google Identity Services typings for Sign in with Google. */
interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleButtonConfiguration {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  width?: number;
  logo_alignment?: "left" | "center";
}

interface GoogleAccountsId {
  initialize: (config: GoogleIdConfiguration) => void;
  renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
  prompt: (
    momentListener?: (notification: {
      isNotDisplayed: () => boolean;
      isSkippedMoment: () => boolean;
    }) => void,
  ) => void;
  disableAutoSelect: () => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface GoogleGlobal {
  accounts: GoogleAccounts;
}

declare global {
  interface Window {
    google?: GoogleGlobal;
  }
}

export {};
