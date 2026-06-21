import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.ts", "src/controls/**", "src/wave-picker/**"],
    }),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/controls.tsx"),
        visualizers: resolve(__dirname, "src/visualizers.ts"),
        primitives: resolve(__dirname, "src/primitives.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@react-piano-keyboard/audio",
        "@react-piano-keyboard/audio/defaults",
        "@react-piano-keyboard/audio/presets",
        "@react-piano-keyboard/music",
      ],
    },
    sourcemap: true,
  },
});
