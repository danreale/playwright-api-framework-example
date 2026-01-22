// @ts-check

import { fileURLToPath } from "url";
import path from "path";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    // define TS project config to enable "linting with type information"
    languageOptions: {
      parserOptions: {
        // reuse the existing `tsconfig.json`
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    files: ["**/*.ts"],
    // enable linting rules beneficial for Playwright projects
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true },
      ], // Enforce return types on functions (helps with API clarity)
      "@typescript-eslint/no-misused-promises": "error", // Catch promises passed to non-promise-accepting functions
      "@typescript-eslint/require-await": "error", // Require await in async functions that don't use it
      "@typescript-eslint/no-unnecessary-type-assertion": "error", // Avoid redundant type assertions
      "@typescript-eslint/prefer-nullish-coalescing": "error", // Prefer ?? over || for null/undefined checks
      "@typescript-eslint/prefer-optional-chain": "error", // Prefer ?. for safer property access
      "@typescript-eslint/no-confusing-void-expression": "error", // Prevent void expressions that could be confusing
    },
  },
);
