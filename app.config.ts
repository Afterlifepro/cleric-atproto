import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { load } from "ts-dotenv";

export const env = load({
  DEV: Boolean,
  B64PWORD: String,
});

export default defineConfig({
  server: {
    preset: "node-server",
    // apiBaseURL: "/oauth",
  },

  vite: {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
