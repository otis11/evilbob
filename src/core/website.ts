import bobDarkTheme from "../plugins/bob-dark-theme";
import { PluginMetaResult } from "./components/plugin-meta-result";
import { type BobPluginMeta, PLUGIN_LIST_SUPPORTED } from "./plugin-list";
(async () => {
	await bobDarkTheme.provideTheme?.();
	await renderPlugins();
})();

export async function renderPlugins() {
	const pluginsContainer = document.createElement("div");
	pluginsContainer.classList.add("plugins-container");
	const sortedPlugins = sortPlugins(PLUGIN_LIST_SUPPORTED);
	for (const plugin of sortedPlugins) {
		pluginsContainer.append(
			new PluginMetaResult(plugin, false).asHtmlElement(),
		);
	}
	document.getElementById("plugins")?.append(pluginsContainer);
}

function sortPlugins(plugins: BobPluginMeta[]) {
	return plugins.sort((a, b) => {
		if (a.name > b.name) {
			return 1;
		}
		if (a.name < b.name) {
			return -1;
		}
		return 0;
	});
}
