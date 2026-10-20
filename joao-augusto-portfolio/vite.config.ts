import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * GitHub Pages notes
 * ------------------
 * - Custom domain or <user>.github.io repo  -> leave BASE_PATH unset (defaults to "/")
 * - Project repo (github.com/you/portfolio) -> set BASE_PATH=/portfolio/
 *   The included GitHub Action does this automatically.
 */
const base = process.env.BASE_PATH ?? "/";

/** SPA fallback: GitHub Pages serves 404.html for unknown paths. */
function spaFallback() {
  return {
    name: "spa-fallback-404",
    closeBundle() {
      const index = resolve("dist/index.html");
      if (existsSync(index)) copyFileSync(index, resolve("dist/404.html"));
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), spaFallback()],
  build: {
    target: "es2022",
    cssMinify: "lightningcss",
  },
});
