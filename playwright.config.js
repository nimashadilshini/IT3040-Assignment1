import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',        // tests folder
  timeout: 60000,            // max time per test
  fullyParallel: false,      // IMPORTANT: keep false for clarity
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,                // IMPORTANT: one worker = clean result
  reporter: [['list'], ['html']],

  use: {
    headless: true,          // NO browser popup
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
    trace: 'off',
  },

  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
