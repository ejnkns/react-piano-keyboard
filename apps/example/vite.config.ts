import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "@locator/babel-jsx/dist",
            {
              env: "development",
            },
          ],
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^react-piano-keyboard\/styles\.css$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/dist/react-piano-keyboard.css",
        ),
      },
      {
        find: /^@react-piano-keyboard\/piano-keyboard\/styles\.css$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/piano-keyboard/dist/piano-keyboard.css",
        ),
      },
      {
        find: /^@react-piano-keyboard\/controls\/styles\.css$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/controls/dist/controls.css",
        ),
      },
      {
        find: /^react-piano-keyboard\/piano$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/piano.tsx",
        ),
      },
      {
        find: /^react-piano-keyboard\/piano-keyboard$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/piano-keyboard.ts",
        ),
      },
      {
        find: /^react-piano-keyboard\/controls\/primitives$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/control-primitives.ts",
        ),
      },
      {
        find: /^react-piano-keyboard\/controls$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/controls.ts",
        ),
      },
      {
        find: /^react-piano-keyboard\/visualizers$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/visualizers.ts",
        ),
      },
      {
        find: /^react-piano-keyboard$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/react-piano-keyboard.ts",
        ),
      },
      {
        find: /^react-piano-keyboard\/music$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/music.ts",
        ),
      },
      {
        find: /^react-piano-keyboard\/audio\/defaults$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/audio-defaults.ts",
        ),
      },
      {
        find: /^react-piano-keyboard\/audio\/presets$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/audio-presets.ts",
        ),
      },
      {
        find: /^react-piano-keyboard\/audio$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/audio.ts",
        ),
      },
      {
        find: /^@react-piano-keyboard\/music$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/music/src/music.ts",
        ),
      },
      {
        find: /^@react-piano-keyboard\/audio\/defaults$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/audio/src/defaults.ts",
        ),
      },
      {
        find: /^@react-piano-keyboard\/audio\/presets$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/audio/src/presets.ts",
        ),
      },
      {
        find: /^@react-piano-keyboard\/audio$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/audio/src/audio.ts",
        ),
      },
      {
        find: /^@react-piano-keyboard\/piano-keyboard$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/piano-keyboard/src/piano-keyboard.tsx",
        ),
      },
      {
        find: /^@react-piano-keyboard\/controls\/visualizers$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/controls/src/visualizers.ts",
        ),
      },
      {
        find: /^@react-piano-keyboard\/controls\/primitives$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/controls/src/primitives.ts",
        ),
      },
      {
        find: /^@react-piano-keyboard\/controls$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/controls/src/controls.tsx",
        ),
      },
    ],
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
