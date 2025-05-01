import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import type { PluginDefinition } from "@evil-bob/plugins/src/types.ts";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { $, Glob } from "bun";
import { build } from "vite";

const buildFirefox = Bun.argv.includes("--firefox");
const buildChromium = Bun.argv.includes("--chromium");
const watch = Bun.argv.includes("--watch") ? {} : null;
const isDevBuild = Bun.argv.includes("--dev");

// chromium will break as it cannot find background.js when its removed for a short time
if (!watch) {
	await $`rm -rf ${path.resolve(__dirname, "../dist")}`;
}
await $`cd ../plugins && bun run build`;

if (buildFirefox) {
	await buildExtension({
		outputFolder: "firefox",
		copy: {
			[path.resolve(__dirname, "../src/manifest-firefox.json")]:
				"manifest.json",
		},
	});
}

if (buildChromium) {
	await buildExtension({
		outputFolder: "chromium",
		copy: {
			[path.resolve(__dirname, "../src/manifest-chromium.json")]:
				"manifest.json",
		},
	});
}

interface BuildExtensionOptions {
	outputFolder: string;
	copy?: Record<string, string>;
}

async function buildExtension(options: BuildExtensionOptions) {
	await $`mkdir -p ${path.resolve(__dirname, "../dist", options.outputFolder)}`;

	const globViewFiles = new Glob("**/*.html");
	const viewFilePaths: string[] = [];
	for await (const file of globViewFiles.scan(
		path.resolve(__dirname, "../src/views/"),
	)) {
		viewFilePaths.push(path.resolve(__dirname, `../src/views/${file}`));
	}
	await build({
		plugins: [react(), tailwindcss()],
		build: {
			emptyOutDir: false,
			watch,
			minify: !isDevBuild,
			rollupOptions: {
				input: [
					path.resolve(__dirname, "../src/content-script.ts"),
					path.resolve(__dirname, "../src/background.ts"),
					...viewFilePaths,
					...(await getPluginEntryPoints()),
				],
				preserveEntrySignatures: "allow-extension",
				output: {
					dir: `dist/${options.outputFolder}`,
					format: "es",
					entryFileNames(chunkInfo) {
						if (
							chunkInfo.facadeModuleId?.includes(
								"packages/plugins/src/plugins",
							)
						) {
							const pluginId = chunkInfo.facadeModuleId
								.split("packages/plugins/src/plugins")[1]
								?.split("/")[1];
							return `plugins/${pluginId}/[name].js`;
						}
						return "[name].js";
					},
				},
			},
		},
	});

	await $`cp -r "${path.resolve(__dirname, "../src/media")}" dist/${options.outputFolder}`;
	await $`cp -r "${path.resolve(__dirname, "../src/content-script-entrypoint.js")}" dist/${options.outputFolder}/content-script-entrypoint.js`;

	if (options.copy) {
		for (const [key, value] of Object.entries(options.copy)) {
			await $`cp -r ${key} dist/${options.outputFolder}/${value}`;
		}
	}
}

async function getPluginEntryPoints() {
	const entryPoints: string[] = [];
	const pluginFolders = readdirSync(
		path.resolve(__dirname, "../../plugins/src/plugins"),
	);

	const commandSlashes: Record<string, string> = {};
	for (const pluginFolder of pluginFolders) {
		const entrypointPath = path.resolve(
			__dirname,
			`../../plugins/src/plugins/${pluginFolder}/index.ts`,
		);
		entryPoints.push(entrypointPath);
		const pluginDefinition = (await import(entrypointPath))
			.default as PluginDefinition;

		// make sure viewSlashes don't clash
		if (pluginDefinition.commands) {
			for (const command of pluginDefinition.commands) {
				if (command.type === "view" && !command.slash) {
					console.error("All views require a slash.");
					process.exit(1);
				}
				if (!command.slash) {
					continue;
				}
				if (commandSlashes[command.slash]) {
					console.error(
						`! Overlapping view slashes. ${command.slash} from ${pluginFolder}. ${commandSlashes[command.slash]} already uses ${command.slash}`,
					);
					process.exit(1);
				} else {
					commandSlashes[command.slash] = pluginFolder;
				}
			}
			entryPoints.push(
				...pluginDefinition.commands.map((view) => {
					const filePathWithoutExtension = path.resolve(
						__dirname,
						`../../plugins/src/plugins/${pluginFolder}/${view.name}`,
					);
					return existsSync(`${filePathWithoutExtension}.ts`)
						? `${filePathWithoutExtension}.ts`
						: `${filePathWithoutExtension}.tsx`;
				}),
			);
		}
	}

	return entryPoints;
}
