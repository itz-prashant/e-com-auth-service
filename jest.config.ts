/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    coverageDirectory: "coverage",
    clearMocks: true,
    verbose: true,
    coverageProvider: "v8",
    collectCoverageFrom: ["src/**/*.ts", "tests/**", "!**/node_modules/**"],
};

export default config;
