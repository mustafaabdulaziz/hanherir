import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // ngrok gibi tünel servislerinden gelen isteklere izin ver (baştaki nokta alt alan adlarını kapsar).
    allowedHosts: [".ngrok-free.app", ".ngrok-free.dev", ".ngrok.app", ".ngrok.io"],
    proxy: {
      "/api": "http://127.0.0.1:5000",
      "/uploads": "http://127.0.0.1:5000"
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
