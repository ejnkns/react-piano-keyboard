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
        find: /^react-piano-keyboard\/hooks$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/hooks.ts",
        ),
      },
      {
        find: /^react-piano-keyboard\/components$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/components.ts",
        ),
      },
      {
        find: /^react-piano-keyboard\/types$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/react-piano-keyboard/src/types.ts",
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
        find: /^@react-piano-keyboard\/music$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/music/src/index.ts",
        ),
      },
      {
        find: /^@react-piano-keyboard\/piano-keyboard$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/piano-keyboard/src/index.ts",
        ),
      },
      {
        find: /^@react-piano-keyboard\/controls$/,
        replacement: path.resolve(
          __dirname,
          "../../packages/controls/src/index.ts",
        ),
      },
    ],
  },
  css: {
    postcss: './postcss.config.js',
  },
});
