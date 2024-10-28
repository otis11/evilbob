import { GroupHeading } from "../../components/group-heading";
import { PluginCard } from "../../components/plugin-card/plugin-card";
import { type BobConfig, updateConfig } from "../../config";
import { coreI18n } from "../../locales";
import { PLUGIN_LIST_SUPPORTED } from "../../plugin-list";

export async function renderPlugins(config: BobConfig) {
	const resultGroups = document.createElement("div");

	resultGroups.append(GroupHeading(coreI18n.t("Plugins")));

	const labelAllGroups = document.createElement("label");
	labelAllGroups.classList.add("result-group-title");

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked =
		PLUGIN_LIST_SUPPORTED.length ===
		PLUGIN_LIST_SUPPORTED.filter((g) => config.pluginsEnabled[g.id]).length;
	checkbox.addEventListener("change", async () => {
		const pluginsEnabled: Record<string, boolean> = {};
		for (const plugin of PLUGIN_LIST_SUPPORTED) {
			pluginsEnabled[plugin.id] = checkbox.checked;
		}
		const permissions = PLUGIN_LIST_SUPPORTED.flatMap(
			(g) => g.permissions,
		).filter((perm) => perm !== undefined);
		const hostPermissions = PLUGIN_LIST_SUPPORTED.flatMap(
			(g) => g.hostPermissions,
		).filter((perm) => perm !== undefined);

		if (checkbox.checked) {
			chrome.permissions.request(
				{
					permissions: permissions,
					origins: hostPermissions,
				},
				async (granted) => {
					if (!granted) {
						console.error("could not grant permission for all?");
						return;
					}
					await updateConfig({
						pluginsEnabled,
					});
					window.location.reload();
				},
			);
		} else {
			chrome.permissions.remove(
				{
					permissions: permissions,
					origins: hostPermissions,
				},
				async (removed) => {
					if (!removed) {
						console.error("could not remove permission for all?");
						return;
					}
					await updateConfig({
						pluginsEnabled,
					});
					window.location.reload();
				},
			);
		}
	});

	const labelText = document.createElement("span");
	labelText.innerText = coreI18n.t("All");
	labelAllGroups.append(checkbox, labelText);

	const resultGroupsContainer = document.createElement("div");
	resultGroupsContainer.classList.add("result-groups-container");
	const sortedPlugins = PLUGIN_LIST_SUPPORTED.sort((a, b) => {
		if (a.name > b.name) {
			return 1;
		}
		if (a.name < b.name) {
			return -1;
		}
		return 0;
	});
	for (const plugin of sortedPlugins) {
		resultGroupsContainer.append(PluginCard(plugin, config));
	}
	resultGroups.append(labelAllGroups, resultGroupsContainer);
	document.body.append(resultGroups);
}
