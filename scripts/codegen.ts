import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathToExtension = join(__dirname, "../dist/chromium");
const context = await chromium.launchPersistentContext("", {
	channel: "chromium",
	args: [
		`--disable-extensions-except=${pathToExtension}`,
		`--load-extension=${pathToExtension}`,
	],
	headless: false,
});
const page = await context.newPage();
await page.pause();
await context.close();
