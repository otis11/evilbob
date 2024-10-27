import { GroupHeading } from "../../components/group-heading";
import { PluginCard } from "../../components/plugin-card/plugin-card";
import { type BobConfig, type PluginConfig, updateConfig } from "../../config";
import { t } from "../../locales/locales";
import { PLUGINS_BROWSER_FILTERED } from "../../plugins";

export async function renderPlugins(config: BobConfig) {
	const resultGroups = document.createElement("div");

	resultGroups.append(GroupHeading(t("Result Groups")));

	const labelAllGroups = document.createElement("label");
	labelAllGroups.classList.add("result-group-title");

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked =
		PLUGINS_BROWSER_FILTERED.length ===
		PLUGINS_BROWSER_FILTERED.filter((g) => config.plugins[g.id()]?.enabled)
			.length;
	checkbox.addEventListener("change", async () => {
		const groupConfig: Record<string, PluginConfig> = {};
		for (const group of PLUGINS_BROWSER_FILTERED) {
			groupConfig[group.id()] = {
				enabled: checkbox.checked,
			};
		}
		const permissions = PLUGINS_BROWSER_FILTERED.flatMap(
			(g) => g.permissions,
		);
		const hostPermissions = PLUGINS_BROWSER_FILTERED.flatMap(
			(g) => g.hostPermissions,
		);

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
						groups: groupConfig,
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
						groups: groupConfig,
					});
					window.location.reload();
				},
			);
		}
	});

	const labelText = document.createElement("span");
	labelText.innerText = t("All");
	labelAllGroups.append(checkbox, labelText);

	const resultGroupsContainer = document.createElement("div");
	resultGroupsContainer.classList.add("result-groups-container");
	const sortedResultGroups = PLUGINS_BROWSER_FILTERED.sort((a, b) => {
		if (a.name > b.name) {
			return 1;
		}
		if (a.name < b.name) {
			return -1;
		}
		return 0;
	});
	for (const group of sortedResultGroups) {
		resultGroupsContainer.append(PluginCard(group, config));
	}
	resultGroups.append(labelAllGroups, resultGroupsContainer);
	document.body.append(resultGroups);
}
