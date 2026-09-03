import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  outputDir: "output/playwright/test-results",
  reporter: [
    ["line"],
    ["html", { outputFolder: "output/playwright/report", open: "never" }]
  ],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: "node tests/support/static-server.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !isCi,
    timeout: 15_000
  }
});
