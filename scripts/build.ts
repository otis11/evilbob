import { existsSync, readdirSync, rmSync } from "node:fs";
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
}
const views = readdirSync(path.resolve(__dirname, "../src/core/views"));
const plugins = readdirSync(path.resolve(__dirname, "../src/plugins"));

await Promise.all([
	// service worker needs to separated as they don't support "import" or "require" / code splitting bundles
	build({
		resolve: {
			alias: {
				"@core": path.resolve(__dirname, "../src/core"),
			},
		},
		build: {
			outDir: "dist/chrome",
			emptyOutDir: false,
			lib: {
				name: "background",
				entry: path.resolve(__dirname, "../src/core/background.ts"),
				fileName: "background",
				formats: ["es"],
			},
			watch,
		},
	}),
	build({
		resolve: {
			alias: {
				"@core": path.resolve(__dirname, "../src/core"),
			},
		},
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
				input: [
					...views.map((view) =>
						path.resolve(
							__dirname,
							`../src/core/views/${view}/index.html`,
						),
					),
					...plugins.map((plugin) =>
						path.resolve(
							__dirname,
							`../src/plugins/${plugin}/index.ts`,
						),
					),
				],
				preserveEntrySignatures: "allow-extension",
				output: {
					entryFileNames(chunkInfo) {
						if (chunkInfo.facadeModuleId?.includes("src/plugins")) {
							const name = chunkInfo.facadeModuleId
								.split("/")
								.at(-2);
							return `plugins/${name}.js`;
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
