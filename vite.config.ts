import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180, // eigener Port statt 5173/5174 – Zahl hier frei änderbar
    strictPort: true, // immer derselbe Port, kein automatisches Hochzählen
    open: true, // Browser beim Start automatisch öffnen
  },
})
