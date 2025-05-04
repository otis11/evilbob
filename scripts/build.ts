import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import type { Plugin, PluginDefinition } from "@/plugins";
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

const plugins = await getPlugins();
await updatePluginList(plugins);

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
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "../src"),
			},
		},
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
						if (chunkInfo.facadeModuleId?.includes("src/plugins")) {
							const pluginId = chunkInfo.facadeModuleId
								.split("src/plugins")[1]
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
	await $`cp -r "${path.resolve(__dirname, "../src/media/favicon.ico")}" dist/${options.outputFolder}/favicon.ico`;
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
		path.resolve(__dirname, "../src/plugins"),
	);

	const commandSlashes: Record<string, string> = {};
	for (const plugin of plugins) {
		entryPoints.push(plugin.entrypointPath);
		const pluginDefinition = (await import(plugin.entrypointPath))
			.default as PluginDefinition;

		// make sure viewSlashes don't clash
		if (pluginDefinition.commands) {
			entryPoints.push(
				...pluginDefinition.commands.map((view) => {
					const filePathWithoutExtension = path.resolve(
						__dirname,
						`../src/plugins/${plugin.folder}/${view.name}`,
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

interface PluginEntryPoint {
	folder: string;
	entrypointPath: string;
	definition: PluginDefinition;
}
async function getPlugins() {
	const plugins: PluginEntryPoint[] = [];
	const pluginFolders = readdirSync(
		path.resolve(__dirname, "../src/plugins"),
	);
	for (const folder of pluginFolders) {
		if (
			(
				await Bun.file(
					path.resolve(__dirname, `../src/plugins/${folder}`),
				).stat()
			).isFile()
		) {
			continue;
		}
		const filePathWithoutExtension = `${path.resolve(__dirname, `../src/plugins/${folder}`)}/index`;
		const entrypointPath = existsSync(`${filePathWithoutExtension}.ts`)
			? `${filePathWithoutExtension}.ts`
			: `${filePathWithoutExtension}.tsx`;

		const pluginDefinition = (await import(entrypointPath))
			.default as PluginDefinition;

		plugins.push({
			entrypointPath,
			folder,
			definition: pluginDefinition,
		});
	}

	return plugins;
}

async function updatePluginList(plugins: PluginEntryPoint[]) {
	const list: Plugin[] = [];
	for (const plugin of plugins) {
		list.push({
			id: plugin.folder,
			definition: plugin.definition,
		});
	}

	await Bun.write(
		path.resolve(__dirname, "../src/plugins/list.json"),
		JSON.stringify(list),
	);
}
