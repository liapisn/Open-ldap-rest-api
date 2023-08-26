/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: "ts-jest/presets/js-with-ts",
  reporters: [
    "default",
    [
      "<rootDir>/node_modules/jest-html-reporter",
      {
        outputPath: "<rootDir>/reports/results/unit/index.html",
        pageTitle: "Unit tests",
      },
    ],
  ],
  testEnvironment: "node",
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFiles: ["dotenv/config"],
  testMatch: ["**/__tests__/**/*.spec.[jt]s"],
};
