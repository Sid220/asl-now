import type {PlaywrightTestConfig} from '@playwright/test';
import {devices} from "@playwright/test";

const config: PlaywrightTestConfig = {
    webServer: {
        command: 'npm run build && npm run preview',
        port: 4173
    },
    testDir: 'tests',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],

                video: 'on',
                trace: 'retain-on-failure',
                screenshot: 'on',


                launchOptions: {
                    args: [
                        "--use-fake-ui-for-media-stream",
                        "--use-fake-device-for-media-stream",
                        "--use-file-for-fake-video-capture=/home/sid/Downloads/720p50_mobcal_ter.y4m",
                        '--use-fake-device-for-media-stream',
                        '--no-sandbox'
                    ],
                },
                permissions: ["camera", "microphone", "accessibility-events"]
            },

        },
    ],
};

export default config;
