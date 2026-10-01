import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import type { InlineConfig } from "vitest/node";

const config: UserConfig & { test: InlineConfig } = {
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
};

export default defineConfig(config);
