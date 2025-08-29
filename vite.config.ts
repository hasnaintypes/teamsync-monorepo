import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ignore TypeScript errors during build
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript warnings
        if (warning.code === "TS_ERROR") return;
        warn(warning);
      },
    },
  },
  esbuild: {
    // Ignore TypeScript errors in esbuild
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
