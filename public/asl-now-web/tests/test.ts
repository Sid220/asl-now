import {expect, test} from '@playwright/test';
import * as assert from "assert";

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

    // Error Modal (no camera)
    await expect(page.locator(".modal-content")).toBeVisible();
    await page.locator('.close-btn').click();

    await expect(page.locator('video.input_video')).toBeVisible();
    const settingsBtn = page.locator(".lucide-settings");
    await expect(settingsBtn).toBeVisible();
    // Settings Modal
    await settingsBtn.click();
    await expect(page.locator(".modal-content")).toBeVisible();
    await page.locator('.show-labels-checkbox').click();
    // Check Localstorage writing
    await page.context().storageState().then(state => {
        const lStorage = state.origins.find((ele) => {
            return ele.origin === 'http://localhost:4173';
        });
        const config = lStorage!.localStorage.find((ele) => {
            return ele.name === 'config';
        });
        const localStorage = JSON.parse(config!.value);
        assert.ok(!localStorage.showLabels);
    });
});