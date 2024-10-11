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

const browsers = ["chrome", "firefox"];

for (const browser of browsers) {
	await Promise.all([
		// background
		build({
			publicDir: `public/${browser}`,
			build: {
				outDir: `dist/${browser}`,
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
			publicDir: `public/${browser}`,
			root: "./src/search-view",
			base: "./",
			build: {
				minify,
				outDir: `../../dist/${browser}/search-view`,
				emptyOutDir: false,
				watch,
			},
		}),
		// options
		build({
			publicDir: `public/${browser}`,
			root: "./src/options-view",
			base: "./",
			build: {
				minify,
				outDir: `../../dist/${browser}/options-view`,
				emptyOutDir: false,
				watch,
			},
		}),
		// user-scripts
		build({
			publicDir: `public/${browser}`,
			root: "./src/user-scripts",
			base: "./",
			build: {
				minify,
				outDir: `../../dist/${browser}/user-scripts`,
				rollupOptions: {
					input: ["src/user-scripts/list-media.ts"],
					output: {
						entryFileNames: "[name].js",
					},
				},
				emptyOutDir: false,
				watch,
			},
		}),
	]);
}
