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
        piano: resolve(__dirname, "src/piano.tsx"),
        "piano-keyboard": resolve(__dirname, "src/piano-keyboard.ts"),
        music: resolve(__dirname, "src/music.ts"),
        audio: resolve(__dirname, "src/audio.ts"),
        "audio-defaults": resolve(__dirname, "src/audio-defaults.ts"),
        "audio-presets": resolve(__dirname, "src/audio-presets.ts"),
        controls: resolve(__dirname, "src/controls.ts"),
        "control-primitives": resolve(__dirname, "src/control-primitives.ts"),
        visualizers: resolve(__dirname, "src/visualizers.ts"),
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
        "@react-piano-keyboard/controls",
        "@react-piano-keyboard/controls/primitives",
        "@react-piano-keyboard/controls/visualizers",
        "@react-piano-keyboard/music",
        "@react-piano-keyboard/piano-keyboard",
      ],
    },
    sourcemap: true,
  },
});
