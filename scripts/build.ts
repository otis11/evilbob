import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import type { WatcherOptions } from "rollup";
import { build } from "vite";

const watch = Bun.argv.includes("--watch")
	? ({ chokidar: { usePolling: true } } as WatcherOptions)
	: undefined;
const minify = Bun.argv.includes("--minify");
const distFolder = path.resolve(__dirname, "../dist");

if (existsSync(distFolder)) {
	rmSync(distFolder, { recursive: true, force: true });
	mkdirSync(distFolder);
}

await Promise.all([
	// background
	build({
		build: {
			minify,
			emptyOutDir: false,
			watch,
			lib: {
				entry: path.resolve(__dirname, "../src/background.ts"),
				name: "background",
				fileName: "background",
				formats: ["es"],
			},
		},
	}),
	// search
	build({
		root: "./src/search-view",
		base: "./",
		build: {
			minify,
			outDir: "../../dist/search-view",
			emptyOutDir: false,
			watch,
		},
	}),
	// options
	build({
		root: "./src/options-view",
		base: "./",
		build: {
			minify,
			outDir: "../../dist/options-view",
			emptyOutDir: false,
			watch,
		},
	}),
]);
