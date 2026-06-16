import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ include: ["src"] })],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/react-piano-keyboard.ts"),
        hooks: resolve(__dirname, "src/hooks.ts"),
        components: resolve(__dirname, "src/components.ts"),
        types: resolve(__dirname, "src/types.ts"),
        constants: resolve(__dirname, "src/constants.ts"),
        pitches: resolve(__dirname, "src/pitches.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
    sourcemap: true,
  },
});
