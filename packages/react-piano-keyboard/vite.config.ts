import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ include: ["src"] })],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/react-piano-keyboard.ts"),
        hooks: resolve(__dirname, "src/hooks.ts"),
        components: resolve(__dirname, "src/components.ts"),
        music: resolve(__dirname, "src/music.ts"),
        types: resolve(__dirname, "src/types.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@react-piano-keyboard/audio",
        "@react-piano-keyboard/controls",
        "@react-piano-keyboard/music",
        "@react-piano-keyboard/piano-keyboard",
      ],
    },
    sourcemap: true,
  },
});
