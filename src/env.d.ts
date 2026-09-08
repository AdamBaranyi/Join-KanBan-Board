/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Basis-URL der Firebase Realtime Database (ohne abschliessenden Slash). */
  readonly VITE_FIREBASE_DB_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
