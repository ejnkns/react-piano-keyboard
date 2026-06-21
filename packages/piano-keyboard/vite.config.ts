import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src"],
      exclude: [
        "src/**/*.test.ts",
        "src/get-piano-keyboard-layout/**",
        "src/piano-notes/**",
      ],
    }),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/piano-keyboard.tsx"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@react-piano-keyboard/music"],
    },
    sourcemap: true,
  },
});
