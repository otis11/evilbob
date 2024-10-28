import type { BobPlugin } from "./BobPlugin";
import { getConfig, updateConfig } from "./config";
import { type BobPluginMeta, PLUGIN_LIST } from "./plugin-list";

export const PLUGINS_LOADED: BobPlugin[] = [];
export const PLUGINS_LOADED_PROVIDE_RESULTS: BobPlugin[] = [];

export async function loadPlugins() {
	const config = await getConfig();
	const promises = [];
	for (const plugin of PLUGIN_LIST) {
		if (config.pluginsEnabled[plugin.id]) {
			promises.push(
				import(plugin.file).then((value) => ({
					id: plugin.id,
					...value.default,
				})),
			);
		}
	}
	const plugins = await Promise.all(promises);
	for (const plugin of plugins) {
		PLUGINS_LOADED.push(plugin);
		if (plugin.provideResults) {
			PLUGINS_LOADED_PROVIDE_RESULTS.push(plugin);
		}
	}
}

export async function enablePlugin(plugin: BobPluginMeta) {
	chrome.permissions.request(
		{
			permissions: plugin.permissions,
			origins: plugin.hostPermissions,
		},
		async (granted) => {
			if (!granted) {
				console.error("could not grant permission for plugin?", plugin);
			}
			await updateConfig({
				pluginsEnabled: {
					[plugin.id]: true,
				},
			});
		},
	);
}

export async function disablePlugin(plugin: BobPluginMeta) {
	chrome.permissions.remove(
		{
			permissions: plugin.permissions,
			origins: plugin.hostPermissions,
		},
		async (removed) => {
			if (!removed) {
				console.error(
					"could not remove permission for plugin?",
					plugin,
				);
			}
			await updateConfig({
				pluginsEnabled: {
					[plugin.id]: false,
				},
			});
		},
	);
}
