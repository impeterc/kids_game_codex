import { expect, test } from '@playwright/test';

test('renders HUD and supports level selection', async ({ page }) => {
  await page.goto('/?level=2');

  await expect(page.getByRole('heading', { name: /kids side scroll adventure/i })).toBeVisible();
  await expect(page.locator('#levelName')).toContainText("Willy's Cartoon Spooky Wasteland");
  await expect(page.locator('#objective')).toContainText('Collect 25 treasures');
});

test('auto-advances from level 1 to level 2 when timer expires', async ({ page }) => {
  await page.goto('/?level=1&duration=1');

  await expect(page.locator('#levelName')).toContainText("Clara's Pink Rainbow Watch");
  await expect(page.locator('#levelName')).toContainText("Willy's Cartoon Spooky Wasteland", { timeout: 6000 });
  await expect(page).toHaveURL(/level=2/);
});
