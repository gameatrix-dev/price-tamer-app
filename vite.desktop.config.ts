import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  base: "./",
  root: path.resolve(process.cwd(), "desktop"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") },
  },
  build: {
    outDir: path.resolve(process.cwd(), "dist-desktop"),
    emptyOutDir: true,
  },
});
