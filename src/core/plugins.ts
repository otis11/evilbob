import type { BobPlugin } from "./BobPlugin";
import { getConfig, updateConfig } from "./config";
import { type BobPluginMeta, PLUGIN_LIST_SUPPORTED } from "./plugin-list";

export let PLUGINS_LOADED: BobPlugin[] = [];
export const PLUGINS_LOADED_PROVIDE_RESULTS: BobPlugin[] = [];

export async function loadPlugins() {
	PLUGINS_LOADED = [];
	const config = await getConfig();
	const promises = [];
	for (const plugin of PLUGIN_LIST_SUPPORTED) {
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
	return await new Promise((resolve) =>
		chrome.permissions.request(
			{
				permissions: plugin.permissions,
				origins: plugin.hostPermissions,
			},
			async (granted) => {
				if (!granted) {
					resolve(false);
					return;
				}
				await updateConfig({
					pluginsEnabled: {
						[plugin.id]: true,
					},
				});
				resolve(true);
			},
		),
	);
}

export async function disablePlugin(plugin: BobPluginMeta) {
	await loadPlugins();
	const permissionsCanRemove: string[] = [];
	const permissionsWithoutPlugin = PLUGINS_LOADED.filter(
		(pl) => pl.id !== plugin.id,
	).flatMap((pl) => pl.permissions);
	for (const permission of plugin.permissions || []) {
		if (!permissionsWithoutPlugin.includes(permission)) {
			permissionsCanRemove.push(permission);
		}
	}
	return await new Promise((resolve) =>
		chrome.permissions.remove(
			{
				permissions: permissionsCanRemove,
				origins: plugin.hostPermissions,
			},
			async (removed) => {
				if (!removed) {
					resolve(false);
					return;
				}
				await updateConfig({
					pluginsEnabled: {
						[plugin.id]: false,
					},
				});
				resolve(true);
			},
		),
	);
}
