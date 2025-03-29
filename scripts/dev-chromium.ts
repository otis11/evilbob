import { $ } from "bun";

setTimeout(async () => {
	await $`bunx web-ext run --target chromium --verbose --source-dir ./dist/chrome`;
}, 1000);

await $`bun run watch`;
