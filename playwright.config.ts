import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 25_000,
  expect: { timeout: 7_500 },
  fullyParallel: true,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npm --prefix react run dev -- --port 4301",
      url: "http://127.0.0.1:4301",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm --prefix vue run dev -- --port 4302",
      url: "http://127.0.0.1:4302",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm --prefix angular run dev -- --port 4303",
      url: "http://127.0.0.1:4303",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "npm --prefix react-pro run dev -- --port 4304",
      url: "http://127.0.0.1:4304",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm --prefix react-cloud run dev -- --port 4305",
      url: "http://127.0.0.1:4305",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
