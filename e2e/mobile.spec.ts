import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 }, isMobile: true });

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.navbar-toggle')).toBeVisible();
  });

  test('should toggle navigation menu', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('.nav-links');
    await expect(navLinks).not.toHaveClass(/open/);

    await page.click('.navbar-toggle');
    await expect(navLinks).toHaveClass(/open/);
  });

  test('should navigate from mobile menu', async ({ page }) => {
    await page.goto('/');
    await page.click('.navbar-toggle');
    await page.click('text=Settings');
    await expect(page).toHaveURL(/setting/);
  });

  test('should display settings form properly on mobile', async ({ page }) => {
    await page.goto('/setting');
    await expect(page.locator('#shower')).toBeVisible();
    await expect(page.locator('#Lm')).toBeVisible();
  });

  test('should display input textarea on mobile', async ({ page }) => {
    await page.goto('/meteor-input');
    await expect(page.locator('#meteor-data')).toBeVisible();
  });

  test('should allow data entry on mobile', async ({ page }) => {
    await page.goto('/setting');
    await page.locator('#shower').fill('PER');
    await page.locator('#curDate').fill('12/08/2024');
    await page.locator('#F').fill('0');
    await page.locator('#Lm').fill('5.75');
    await page.locator('#Dec').fill('30');
    await page.locator('#RaStartTime').fill('1900');
    await page.locator('#RaStartValue').fill('236');

    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\n3\n2200');
    await expect(page.locator('app-statistics')).toContainText('PER');
  });

  test('should display distribution tables on mobile', async ({ page }) => {
    // Set up settings and data
    await page.goto('/setting');
    await page.locator('#shower').fill('PER');
    await page.locator('#curDate').fill('12/08/2024');
    await page.locator('#F').fill('0');
    await page.locator('#Lm').fill('5.75');
    await page.locator('#Dec').fill('30');
    await page.locator('#RaStartTime').fill('1900');
    await page.locator('#RaStartValue').fill('236');

    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\n3\n2200');

    await page.goto('/count-distribution');
    await expect(page.locator('table')).toBeVisible();
    const tableWrapper = page.locator('.table-wrapper');
    await expect(tableWrapper).toBeVisible();
  });

  test('should overlay mobile menu without pushing content', async ({ page }) => {
    await page.goto('/meteor-input');
    const mainContent = page.locator('.main-content');
    const mainTopBefore = await mainContent.boundingBox();

    await page.click('.navbar-toggle');
    await expect(page.locator('.nav-links')).toHaveClass(/open/);

    const mainTopAfter = await mainContent.boundingBox();
    expect(mainTopAfter!.y).toBe(mainTopBefore!.y);
  });

  test('should show line numbers on mobile', async ({ page }) => {
    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\n3\n2200');
    const gutter = page.locator('.line-gutter');
    await expect(gutter).toBeVisible();
  });

  test('should have numeric input mode on textarea', async ({ page }) => {
    await page.goto('/meteor-input');
    const textarea = page.locator('#meteor-data');
    await expect(textarea).toHaveAttribute('inputmode', 'numeric');
  });
});
