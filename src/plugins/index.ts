import { getConfig, updateConfig } from "../config";
import { browserName } from "../platform";
import type { Plugin } from "./Plugin";
import { BobPlugin } from "./bob";
import { WindowPlugin } from "./window";

export const PLUGINS = [new WindowPlugin(), new BobPlugin()];

export const PLUGINS_BROWSER_FILTERED = (() => {
	return PLUGINS.filter((plugin) => {
		return plugin.supportedBrowsers.includes(browserName);
	});
})();

export async function getEnabledPlugins() {
	const config = await getConfig();
	const plugins = [];
	for (const plugin of PLUGINS_BROWSER_FILTERED) {
		if (config.plugins[plugin.id()]?.enabled) {
			plugins.push(plugin);
		}
	}
	return plugins;
}

export async function enablePlugin(plugin: Plugin) {
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
				plugins: {
					[plugin.id()]: {
						enabled: true,
					},
				},
			});
		},
	);
}

export async function disablePlugin(plugin: Plugin) {
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
				plugins: {
					[plugin.id()]: {
						enabled: false,
					},
				},
			});
		},
	);
}
