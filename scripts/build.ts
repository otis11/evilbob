import { existsSync, lstatSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { $ } from "bun";
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
const views = readdirSync(path.resolve(__dirname, "../src/views")).filter(
	(file) =>
		lstatSync(
			path.resolve(__dirname, `../src/views/${file}`),
		).isDirectory(),
);

await Promise.all([
	// service worker needs to separateed as they dont support "import" or "require" / code splitting bundles
	build({
		build: {
			outDir: "dist/chrome",
			emptyOutDir: false,
			lib: {
				name: "background",
				entry: path.resolve(__dirname, "../src/background.ts"),
				fileName: "background",
				formats: ["es"],
			},
			watch,
		},
	}),
	build({
		plugins: [
			{
				name: "build-end-hook",
				closeBundle: async () => {
					await $`cp -r dist/chrome dist/firefox`;
					await $`cp src/manifest-chrome.json dist/chrome/manifest.json`;
					await $`cp src/manifest-firefox.json dist/firefox/manifest.json`;
				},
			},
		],
		base: "./",
		build: {
			rollupOptions: {
				input: views.map((view) =>
					path.resolve(__dirname, `../src/views/${view}/index.html`),
				),
				output: {
					entryFileNames(chunkInfo) {
						if (chunkInfo.name === "background") {
							return "[name].js";
						}
						return "assets/[name]-[hash].js";
					},
				},
			},
			outDir: "dist/chrome",
			minify,
			emptyOutDir: false,
			watch,
		},
	}),
]);
