import { readdirSync } from "node:fs";
import path from "node:path";
import type { Plugin, PluginDefinition } from "../src/types.ts";
const list: Plugin[] = [];
const pluginFolders = readdirSync(
	path.resolve(__dirname, "../../plugins/src/plugins"),
);
for (const pluginFolder of pluginFolders) {
	const entrypointPath = path.resolve(
		__dirname,
		`../../plugins/src/plugins/${pluginFolder}/index.ts`,
	);
	const pluginDefinition = (await import(entrypointPath))
		.default as PluginDefinition;
	const plugin: Plugin = {
		id: pluginFolder,
		definition: pluginDefinition,
	};
	list.push(plugin);
}

await Bun.write(
	path.resolve(__dirname, "../src/list.json"),
	JSON.stringify(list),
);
