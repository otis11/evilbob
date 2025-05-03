import type { Plugin, PluginCommandImported } from "@/plugins";
import { getConfig, updateConfig } from "./config.ts";

export async function enablePlugin(plugin: Plugin) {
	return await new Promise((resolve) =>
		chrome.permissions.request(
			{
				permissions: plugin.definition.permissions,
				origins: plugin.definition.hostPermissions,
			},
			async (granted) => {
				if (!granted) {
					resolve(false);
					return;
				}
				await updateConfig({
					plugins: {
						enabled: {
							[plugin.id]: true,
						},
					},
				});
				resolve(true);
			},
		),
	);
}

export async function disablePlugin(plugin: Plugin) {
	const plugins = await loadEnabledPlugins();
	const permissionsCanRemove: chrome.runtime.ManifestPermissions[] = [];
	const permissionsWithoutPlugin = plugins
		.filter((pl) => pl.id !== plugin.id)
		.flatMap((pl) => pl.definition.permissions);
	for (const permission of plugin.definition.permissions || []) {
		if (!permissionsWithoutPlugin.includes(permission)) {
			permissionsCanRemove.push(permission);
		}
	}
	return await new Promise((resolve) =>
		chrome.permissions.remove(
			{
				permissions: permissionsCanRemove,
				origins: plugin.definition.hostPermissions,
			},
			async (removed) => {
				if (!removed) {
					resolve(false);
					return;
				}
				await updateConfig({
					plugins: {
						enabled: {
							[plugin.id]: false,
						},
					},
				});
				resolve(true);
			},
		),
	);
}

export async function loadEnabledPlugins() {
	const config = await getConfig();
	const plugins: Plugin[] = [];
	for (const pluginId of Object.keys(config.plugins.enabled)) {
		const definition = await importPluginDefinition(pluginId);
		plugins.push({
			id: pluginId,
			definition: definition,
		});
	}
	return plugins;
}

export async function importPluginCommand(
	pluginId: string,
	name: string,
): Promise<PluginCommandImported> {
	// TODO fix support persistent scripts
	return await import(
		`/plugins/${pluginId}/${name}.js?version=${Date.now()}`
	);
}

export async function importPluginDefinition(pluginId: string) {
	return (await import(`/plugins/${pluginId}/index.js`)).default;
}
