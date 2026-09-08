/**
 * Initialen aus einem Namen: erster + letzter Namensteil (wie im Original).
 * z. B. "Adam Baranyi" → "AB", "Guest" → "G".
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  let initials = parts[0].charAt(0);
  if (parts.length > 1) initials += parts[parts.length - 1].charAt(0);
  return initials.toUpperCase();
}
