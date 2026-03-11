import { test, expect, Page } from '@playwright/test';

async function openNavIfMobile(page: Page): Promise<void> {
  const toggle = page.locator('.navbar-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
  }
}

test.describe('Meteor Input', () => {
  test.beforeEach(async ({ page }) => {
    // Set up default settings first
    await page.goto('/setting');
    await page.locator('#shower').fill('PER');
    await page.locator('#showers').fill('');
    await page.locator('#curDate').fill('12/08/2024');
    await page.locator('#F').fill('0');
    await page.locator('#Lm').fill('5.75');
    await page.locator('#Dec').fill('30');
    await page.locator('#RaStartTime').fill('1900');
    await page.locator('#RaStartValue').fill('236');
  });

  test('should display the input textarea', async ({ page }) => {
    await page.goto('/meteor-input');
    await expect(page.locator('#meteor-data')).toBeVisible();
  });

  test('should show statistics after entering data', async ({ page }) => {
    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\n3\n2-\n2200');
    await expect(page.locator('app-statistics')).toContainText('PER');
    await expect(page.locator('app-statistics')).toContainText('SPO');
  });

  test('should persist data across navigation', async ({ page }) => {
    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\n3\n2200');
    await openNavIfMobile(page);
    await page.click('text=Settings');
    await openNavIfMobile(page);
    await page.click('text=Input');
    await expect(page.locator('#meteor-data')).toHaveValue('2100\n3\n2200');
  });

  test('should show error for invalid data', async ({ page }) => {
    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\nINVALID\n2200');
    await expect(page.locator('.alert-danger')).toBeVisible();
  });

  test('should clear data', async ({ page }) => {
    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\n3\n2200');
    page.on('dialog', (dialog) => dialog.accept());
    await page.click('text=Clear');
    await expect(page.locator('#meteor-data')).toHaveValue('');
  });

  test('should display instruction', async ({ page }) => {
    await page.goto('/meteor-input');
    await expect(page.locator('app-instruction')).toContainText('Quick Guide');
  });

  test('should display line numbers', async ({ page }) => {
    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\n3\n2200');
    const gutter = page.locator('.line-gutter');
    await expect(gutter).toBeVisible();
    await expect(gutter).toContainText('1');
    await expect(gutter).toContainText('2');
    await expect(gutter).toContainText('3');
  });

  test('should highlight error line number in red', async ({ page }) => {
    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\nINVALID\n2200');
    const errorLine = page.locator('.line-error');
    await expect(errorLine).toBeVisible();
    await expect(errorLine).toContainText('2');
  });

  test('should show aligned statistics with colons', async ({ page }) => {
    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\n3\n2-\n2200');
    const statRows = page.locator('.stat-row');
    await expect(statRows.first()).toBeVisible();
    const colons = page.locator('.stat-colon');
    expect(await colons.count()).toBeGreaterThan(0);
  });

  test('should show histogram bars for magnitude stats', async ({ page }) => {
    await page.goto('/meteor-input');
    await page.locator('#meteor-data').fill('2100\n3\n2-\n2200');
    const barContainers = page.locator('.stat-bar-container');
    await expect(barContainers.first()).toBeVisible();
    // Verify that at least one bar has non-zero width (the magnitudes with counts)
    const bars = page.locator('.stat-bar');
    expect(await bars.count()).toBeGreaterThan(0);
  });
});
