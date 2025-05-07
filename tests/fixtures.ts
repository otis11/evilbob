import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type BrowserContext, test as base, chromium } from "@playwright/test";

export const test = base.extend<{
	context: BrowserContext;
	extensionId: string;
}>({
	// biome-ignore lint/correctness/noEmptyPattern: empty for now.
	context: async ({}, use) => {
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
});
export const expect = test.expect;
