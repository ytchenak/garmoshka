import { test, expect, Page } from '@playwright/test';

async function openNavIfMobile(page: Page): Promise<void> {
  const toggle = page.locator('.navbar-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
  }
}

test.describe('Settings', () => {
  test('should display default values', async ({ page }) => {
    await page.goto('/setting');
    await expect(page.locator('#shower')).toHaveValue('PER');
    await expect(page.locator('#Lm')).toHaveValue('5.75');
    await expect(page.locator('#Dec')).toHaveValue('30');
    await expect(page.locator('#F')).toHaveValue('0');
    await expect(page.locator('#RaStartTime')).toHaveValue('1900');
    await expect(page.locator('#RaStartValue')).toHaveValue('236');
  });

  test('should persist settings changes', async ({ page }) => {
    await page.goto('/setting');
    await page.locator('#shower').fill('GEM');
    await page.locator('#Lm').fill('6.0');

    // Navigate away and back
    await openNavIfMobile(page);
    await page.click('text=Input');
    await openNavIfMobile(page);
    await page.click('text=Settings');

    await expect(page.locator('#shower')).toHaveValue('GEM');
    await expect(page.locator('#Lm')).toHaveValue('6.0');
  });

  test('should have hour-to-degree converter', async ({ page }) => {
    await page.goto('/setting');
    await expect(page.locator('app-hour-to-degree-converter')).toBeVisible();
  });

  test('should convert time to degrees', async ({ page }) => {
    await page.goto('/setting');
    const timeInput = page.locator('input[placeholder="HHMMSS"]');
    const degInput = page.locator('input[placeholder="Degrees"]');

    await timeInput.fill('120000');
    await expect(degInput).toHaveValue('180.00');
  });
});
