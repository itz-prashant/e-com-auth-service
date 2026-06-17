// @ts-check

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "eslint.config.mjs",
            "jest.config.ts",
        ],
    },

    js.configs.recommended,

    {
        files: ["src/**/*.ts"],

        extends: [...tseslint.configs.recommendedTypeChecked],

        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },

        rules: {
            "no-console": "off",
            "@typescript-eslint/no-misused-promise": "off",
        },
    },
);
