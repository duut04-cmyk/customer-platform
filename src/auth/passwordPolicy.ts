const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_POLICY_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.";

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return PASSWORD_POLICY_MESSAGE;
  }
  if (!/[A-Z]/.test(password)) {
    return PASSWORD_POLICY_MESSAGE;
  }
  if (!/[a-z]/.test(password)) {
    return PASSWORD_POLICY_MESSAGE;
  }
  if (!/[0-9]/.test(password)) {
    return PASSWORD_POLICY_MESSAGE;
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return PASSWORD_POLICY_MESSAGE;
  }
  return null;
}
