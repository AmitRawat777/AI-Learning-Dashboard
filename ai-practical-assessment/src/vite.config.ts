import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  // DDEV Vite integration: https://docs.ddev.com/en/stable/users/usage/vite/
  server: {
    // Respond to all network requests inside the DDEV web container.
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    // Asset URLs must use the DDEV router origin during development.
    origin: process.env.DDEV_PRIMARY_URL_WITHOUT_PORT
      ? `${process.env.DDEV_PRIMARY_URL_WITHOUT_PORT}:5173`
      : "http://localhost:5173",
    // HMR through the DDEV HTTPS router (port 5173).
    hmr: process.env.DDEV_PRIMARY_URL_WITHOUT_PORT
      ? {
          protocol: "wss",
          host: new URL(process.env.DDEV_PRIMARY_URL_WITHOUT_PORT).hostname,
          clientPort: 5173,
        }
      : undefined,
    // Allow requests from *.ddev.site domains.
    cors: {
      origin: /https?:\/\/([A-Za-z0-9\-\.]+)?(\.ddev\.site)(?::\d+)?$/,
    },
    // Proxy API requests to the Drupal backend to avoid CORS during local dev.
    proxy: {
      "/jsonapi": {
        target: process.env.DDEV_PRIMARY_URL || "https://ai-practical-assessment.ddev.site",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: process.env.DDEV_PRIMARY_URL || "https://ai-practical-assessment.ddev.site",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
