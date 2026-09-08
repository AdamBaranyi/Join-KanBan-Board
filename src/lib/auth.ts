import { getData, putData } from "./firebase";
import type { User } from "./schemas";
import type { SessionUser } from "./session";

type UsersMap = Record<string, User>;

/**
 * Sucht einen Nutzer per E-Mail + Passwort (Klartext-Abgleich wie im Original)
 * im Node "join-react/users". Gibt den Session-Nutzer zurück oder null.
 */
export async function authenticateUser(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const users = await getData<UsersMap>("users");
  if (!users) return null;

  for (const id in users) {
    const u = users[id];
    if (u.email === email && u.password === password) {
      return { id, name: u.name, email: u.email };
    }
  }
  return null;
}

/** Erzeugt die nächste fortlaufende User-ID ("u1", "u2", …) wie im Original. */
export async function generateUserId(): Promise<string> {
  const users = (await getData<UsersMap>("users")) ?? {};
  const numbers = Object.keys(users)
    .filter((id) => id.startsWith("u"))
    .map((id) => parseInt(id.slice(1), 10))
    .filter((n) => !Number.isNaN(n));
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `u${next}`;
}

/** Legt einen neuen Nutzer unter "join-react/users/{id}" an. */
export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const id = await generateUserId();
  const newUser: User = { id, ...input };
  await putData(`users/${id}`, newUser);
  return newUser;
}
