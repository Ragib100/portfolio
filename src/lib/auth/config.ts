export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 5;

export function getSessionCookieName() {
  return process.env.SESSION_COOKIE_NAME || "__session_admin";
}

export function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAllowedAdmin(email: string | undefined) {
  return Boolean(email && getAdminEmails().has(email.toLowerCase()));
}
