import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import type { WatcherOptions } from "rollup";
import { build } from "vite";

const watch = Bun.argv.includes("--watch")
	? ({ chokidar: { usePolling: true } } as WatcherOptions)
	: undefined;
const distFolder = path.resolve(__dirname, "../dist");

if (existsSync(distFolder)) {
	rmSync(distFolder, { recursive: true, force: true });
	mkdirSync(distFolder);
}

await Promise.all([
	// background
	build({
		build: {
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
        root: './src/search',
        base: './',
		build: {
            outDir: '../../dist/search',
			emptyOutDir: false,
			watch,
		},
	}),
]);
