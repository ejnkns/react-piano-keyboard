import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/__tests__/**",
        "src/use-music-notes/**",
      ],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        defaults: resolve(__dirname, "src/defaults.ts"),
        presets: resolve(__dirname, "src/presets.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "@react-piano-keyboard/music"],
    },
    sourcemap: true,
  },
});
