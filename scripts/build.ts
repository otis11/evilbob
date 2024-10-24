import {
	cpSync,
	existsSync,
	fstatSync,
	lstatSync,
	mkdirSync,
	readdirSync,
	rmSync,
} from "node:fs";
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

const views = readdirSync(path.resolve(__dirname, "../src/views")).filter(
	(file) =>
		lstatSync(
			path.resolve(__dirname, `../src/views/${file}`),
		).isDirectory(),
);
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
		// views
		...views.map((view) => {
			return build({
				publicDir: `public/${browser}`,
				root: `./src/views/${view}`,
				base: "./",
				build: {
					minify,
					outDir: `../../../dist/${browser}/views/${view}`,
					emptyOutDir: false,
					watch,
				},
			});
		}),
	]);
}
