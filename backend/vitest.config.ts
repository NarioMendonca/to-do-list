import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["./src/"],
    },
    fileParallelism: false,
    projects: [
      {
        extends: true,
        test: {
          name: "e2e",
          include: ["src/tests/e2e/**/*.e2e.spec.ts"],
          setupFiles: ["src/tests/e2e/E2ESetup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["src/tests/integration/**/*.spec.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/tests/units/**/*.spec.ts"],
        },
      },
    ],
  },
});
