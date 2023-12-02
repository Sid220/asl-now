import {expect, test} from '@playwright/test';

test('about page has expected h1', async ({page}) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', {name: 'About ASLNow!'})).toBeVisible();
});

test('index requires welcome, tutorial', async ({page}) => {
    await page.goto('/');
    const closeBtn = page.locator('.close-btn');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    const startBtn = page.getByRole('button', {name: 'Start'});
    await expect(startBtn).toBeVisible();
    await startBtn.click();
    await expect(startBtn).toBeHidden();
    await expect(page.locator('video.input_video')).toBeVisible();
});