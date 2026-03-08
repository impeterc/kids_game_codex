import { expect, test } from '@playwright/test';

test('renders HUD and supports level selection', async ({ page }) => {
  await page.goto('/?level=2');

  await expect(page.getByRole('heading', { name: /kids side scroll adventure/i })).toBeVisible();
  await expect(page.locator('#levelName')).toContainText("Willy's Cartoon Spooky Wasteland");
  await expect(page.locator('#objective')).toContainText('Collect 25 treasures');
  await expect(page.locator('#status')).toContainText('Treasures: 0/25');
  await expect(page.locator('#status')).toContainText('Danger streak: 0/10');
});
