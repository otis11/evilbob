import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_CONFIG, type EvilbobConfig } from "@/lib/config.ts";
import {
	type BrowserContext,
	type Page,
	test as base,
	chromium,
} from "@playwright/test";

export const test = base.extend<{
	context: BrowserContext;
	extensionId: string;
	extensionUrl: string;
	openEvilbob: () => Promise<void>;
	enablePlugin: () => Promise<void>;
	openedPage: Page;
	config: Partial<EvilbobConfig>;
}>({
	config: DEFAULT_CONFIG,
	context: async ({ config }, use) => {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = dirname(__filename);
		const pathToExtension = join(__dirname, "../dist/chromium");
		const context = await chromium.launchPersistentContext("", {
			channel: "chromium",
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`,
			],
		});
		let [background] = context.serviceWorkers();
		if (!background)
			background = await context.waitForEvent("serviceworker");
		await new Promise((resolve) => setTimeout(resolve, 1000));
		await background.evaluate(
			async ([c, d]) => {
				await chrome.storage.sync.set({
					config: {
						...d,
						...c,
					},
				});
			},
			[config, DEFAULT_CONFIG],
		);
		await use(context);
		await context.close();
	},
	extensionId: async ({ context }, use) => {
		let [background] = context.serviceWorkers();
		if (!background)
			background = await context.waitForEvent("serviceworker");

		const extensionId = background.url().split("/")[2];
		await use(extensionId || "");
	},
	extensionUrl: async ({ context }, use) => {
		let [background] = context.serviceWorkers();
		if (!background)
			background = await context.waitForEvent("serviceworker");

		const extensionId = background.url().split("/")[2];
		await use(extensionId ? `chrome-extension://${extensionId}` : "");
	},
	openEvilbob: async ({ page }, use) => {
		// https://github.com/microsoft/playwright/issues/26693
		// playwright does not currently support opening extensions via a shortcut
		// __IS_DEV_BUILD__  adds a button to open evilbob
		await use(async () => {
			await page.getByTestId("open-evilbob-button").click();
		});
	},
	openedPage: async ({ page, extensionUrl, openEvilbob }, use) => {
		await page.goto(`${extensionUrl}/src/views/welcome/welcome.html`);
		await openEvilbob();
		await use(page);
	},
});
export const expect = test.expect;
