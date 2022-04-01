import { test, expect } from '@playwright/test'

test('Navigate to index page and ensure h1 test', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/')
  // The new page should contain an h1 with "About Page"
  await expect(page.locator('h1')).toContainText('Feedback Central')
})