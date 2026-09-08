/**
 * Schmaler REST-Wrapper um die Firebase Realtime Database.
 *
 * Wie im Original greifen wir per fetch() auf die <pfad>.json-Endpunkte zu –
 * kein Firebase-SDK nötig. Alle Daten liegen unter dem Node "join-react/",
 * damit wir die Original-Daten der Vanilla-Version nicht berühren.
 */

const DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;
const ROOT = "join-react";

function endpoint(path: string): string {
  return `${DB_URL}/${ROOT}/${path}.json`;
}

/** GET – liefert die Daten unter `path` oder null, wenn nichts existiert. */
export async function getData<T = unknown>(path: string): Promise<T | null> {
  const res = await fetch(endpoint(path));
  if (!res.ok) throw new Error(`GET ${path} fehlgeschlagen (${res.status})`);
  return (await res.json()) as T | null;
}

/** PUT – legt die Daten unter `path` an oder überschreibt sie komplett. */
export async function putData<T>(path: string, data: T): Promise<T> {
  const res = await fetch(endpoint(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${path} fehlgeschlagen (${res.status})`);
  return (await res.json()) as T;
}

/** PATCH – aktualisiert einzelne Felder unter `path`. */
export async function patchData<T>(
  path: string,
  data: Partial<T>,
): Promise<Partial<T>> {
  const res = await fetch(endpoint(path), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PATCH ${path} fehlgeschlagen (${res.status})`);
  return (await res.json()) as Partial<T>;
}

/** POST – erzeugt einen neuen Eintrag mit Firebase-Auto-ID ({ name: "<key>" }). */
export async function postData<T>(
  path: string,
  data: T,
): Promise<{ name: string }> {
  const res = await fetch(endpoint(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${path} fehlgeschlagen (${res.status})`);
  return (await res.json()) as { name: string };
}

/** DELETE – entfernt die Daten unter `path`. */
export async function deleteData(path: string): Promise<void> {
  const res = await fetch(endpoint(path), { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE ${path} fehlgeschlagen (${res.status})`);
}
