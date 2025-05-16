import path from "node:path";
import { chromium } from "@playwright/test";
import { $ } from "bun";

await $`bun run build:chromium -- --dev`;

const buildWatchProcess = Bun.spawn(["bun", "run", "watch:chromium"]);
const pathToExtension = path.join(__dirname, "../dist/chromium");
const browserContext = await chromium.launchPersistentContext("", {
	channel: "chromium",
	headless: false,
	handleSIGINT: false,
	args: [
		`--disable-extensions-except=${pathToExtension}`,
		`--load-extension=${pathToExtension}`,
	],
});
const page = await browserContext.newPage();
page.goto("https://github.com/otis11");

async function cleanup() {
	buildWatchProcess.kill("SIGINT");
	await browserContext.close();
	process.exit(0);
}

process.on("SIGINT", async () => {
	await cleanup();
});

process.on("SIGTERM", async () => {
	await cleanup();
});
