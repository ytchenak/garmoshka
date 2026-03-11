import { test, expect, Page } from '@playwright/test';

async function openNavIfMobile(page: Page): Promise<void> {
  const toggle = page.locator('.navbar-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
  }
}

test.describe('Sheet / Distribution', () => {
  test.beforeEach(async ({ page }) => {
    // Set up settings
    await page.goto('/setting');
    await page.locator('#shower').fill('PER');
    await page.locator('#showers').fill('');
    await page.locator('#curDate').fill('12/08/2024');
    await page.locator('#F').fill('0');
    await page.locator('#Lm').fill('5.75');
    await page.locator('#Dec').fill('30');
    await page.locator('#RaStartTime').fill('1900');
    await page.locator('#RaStartValue').fill('236');

    // Enter observation data
    await openNavIfMobile(page);
    await page.click('text=Input');
    await page.locator('#meteor-data').fill('2100\n3\n2-\n2200');
  });

  test('should display count distribution table', async ({ page }) => {
    await page.goto('/count-distribution');
    await expect(page.locator('h2')).toHaveText('Count Distribution');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th').first()).toBeVisible();
  });

  test('should display magnitude distribution table', async ({ page }) => {
    await page.goto('/magnitude-distribution');
    await expect(page.locator('h2')).toHaveText('Magnitude Distribution');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should have export button', async ({ page }) => {
    await page.goto('/count-distribution');
    await expect(page.locator('text=Export as CSV')).toBeVisible();
  });
});
