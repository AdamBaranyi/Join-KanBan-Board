import { z } from "zod";

/**
 * Eingeloggter Nutzer wird – wie im Original – im sessionStorage gehalten
 * (Schlüssel "current_user"). Geht beim Schliessen des Tabs verloren.
 */

const SESSION_KEY = "current_user";

export const sessionUserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

/** Gast-Nutzer (entspricht dem Gast-Login im Original). */
export const GUEST_USER: SessionUser = {
  name: "Guest",
  email: "guest@join.com",
};

export function setCurrentUser(user: SessionUser): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getCurrentUser(): SessionUser | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = sessionUserSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function clearCurrentUser(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isGuest(user: SessionUser | null): boolean {
  return user?.email === GUEST_USER.email;
}
