import { $ } from "bun";

setTimeout(async () => {
	await $`bunx web-ext run --verbose --source-dir ./dist/firefox`;
}, 1000);

await $`bun run watch`;
