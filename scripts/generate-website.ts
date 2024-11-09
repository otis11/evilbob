import { $ } from "bun";

await $`bun run build:website`;
await $`rm -rf ./docs`;
await $`mv ./dist/website ./docs`;
