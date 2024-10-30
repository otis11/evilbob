import { Checkbox } from "../../components/checkbox";
import { FlexContainer } from "../../components/flex-container";
import { GroupHeading } from "../../components/group-heading";
import { PluginCard } from "../../components/plugin-card/plugin-card";
import { type BobConfig, updateConfig } from "../../config";
import { coreI18n } from "../../locales";
import { type BobPluginMeta, PLUGIN_LIST_SUPPORTED } from "../../plugin-list";

export async function renderPlugins(config: BobConfig) {
	const plugins = document.createElement("div");
	plugins.append(GroupHeading(coreI18n.t("Plugins")));

	const pluginsContainer = document.createElement("div");
	pluginsContainer.classList.add("result-groups-container");
	const sortedPlugins = sortPlugins(PLUGIN_LIST_SUPPORTED);
	for (const plugin of sortedPlugins) {
		pluginsContainer.append(PluginCard(plugin, config));
	}
	plugins.append(
		makeAllPluginsCheckbox(config),
		makeFilterPluginsCheckboxes(pluginsContainer, config),
		pluginsContainer,
	);
	document.body.append(plugins);
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

function makeFilterPluginsCheckboxes(target: HTMLElement, config: BobConfig) {
	const container = FlexContainer({});
	const [labelThemes, checkboxThemes] = Checkbox("Themes");
	const [labelResults, checkboxResults] = Checkbox("Resutls");
	const onFilterChange = () => {
		const plugins = PLUGIN_LIST_SUPPORTED.filter((plugin) => {
			if (checkboxResults.checked && !plugin.providesResults) {
				return false;
			}
			if (checkboxThemes.checked && !plugin.providesTheme) {
				return false;
			}
			return true;
		});
		target.innerHTML = "";
		target.append(...plugins.map((plugin) => PluginCard(plugin, config)));
	};

	checkboxThemes.addEventListener("change", onFilterChange);
	checkboxResults.addEventListener("change", onFilterChange);

	container.append(labelThemes, labelResults);
	return container;
}

function makeAllPluginsCheckbox(config: BobConfig) {
	const labelAllPlugins = document.createElement("label");
	labelAllPlugins.classList.add("result-group-title");

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
	labelText.innerText = coreI18n.t("Disable/Enabled all plugins");
	labelAllPlugins.append(checkbox, labelText);
	return labelAllPlugins;
}
