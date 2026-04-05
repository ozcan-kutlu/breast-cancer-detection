import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPluginPkg from "@next/eslint-plugin-next";

const nextFlat = nextPluginPkg.flatConfig;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "next-env.d.ts",
      "eslint.config.mjs",
    ],
  },
  nextFlat.coreWebVitals,
  ...compat.extends("next/typescript"),
];
