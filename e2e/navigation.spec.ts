import { test, expect, Page } from '@playwright/test';

async function openNavIfMobile(page: Page): Promise<void> {
  const toggle = page.locator('.navbar-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
  }
}

test.describe('Navigation', () => {
  test('should load the app and redirect to meteor-input', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/meteor-input/);
  });

  test('should display the navbar brand', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.navbar-brand')).toContainText('Garmoshka');
  });

  test('should navigate to Settings page', async ({ page }) => {
    await page.goto('/');
    await openNavIfMobile(page);
    await page.click('text=Settings');
    await expect(page).toHaveURL(/setting/);
    await expect(page.locator('label[for="shower"]')).toBeVisible();
  });

  test('should navigate to Input page', async ({ page }) => {
    await page.goto('/');
    await openNavIfMobile(page);
    await page.click('text=Input');
    await expect(page).toHaveURL(/meteor-input/);
    await expect(page.locator('#meteor-data')).toBeVisible();
  });

  test('should navigate to Count Distribution page', async ({ page }) => {
    await page.goto('/');
    await openNavIfMobile(page);
    await page.click('text=Count Distribution');
    await expect(page).toHaveURL(/count-distribution/);
  });

  test('should navigate to Magnitude Distribution page', async ({ page }) => {
    await page.goto('/');
    await openNavIfMobile(page);
    await page.click('text=Magnitude Distribution');
    await expect(page).toHaveURL(/magnitude-distribution/);
  });
});
