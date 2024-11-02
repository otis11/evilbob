import { Checkbox } from "../../components/checkbox";
import { Span } from "../../components/elements";
import { FlexContainer } from "../../components/flex-container";
import { PluginMetaResult } from "../../components/plugin-meta-result";
import { type BobConfig, updateConfig } from "../../config";
import { iconFromString, iconOpenInNew } from "../../icons";
import { coreI18n } from "../../locales";
import { type BobPluginMeta, PLUGIN_LIST_SUPPORTED } from "../../plugin-list";

export async function renderPlugins(config: BobConfig) {
	const plugins = document.createElement("div");
	const pluginsContainer = document.createElement("div");
	pluginsContainer.classList.add("plugins-container");
	const sortedPlugins = sortPlugins(PLUGIN_LIST_SUPPORTED);
	for (const plugin of sortedPlugins) {
		pluginsContainer.append(
			new PluginMetaResult(
				plugin,
				!!config.pluginsEnabled[plugin.id],
			).asHtmlElement(),
		);
	}
	plugins.append(
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
	const container = FlexContainer({
		gap: "32px",
		alignItems: "center",
		flexWrap: "wrap",
		justifyContent: "center",
	});
	container.style.padding = "8px 0";
	const [labelThemes, checkboxThemes] = Checkbox("Themes");
	const [labelResults, checkboxResults] = Checkbox("Results");
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
		target.append(
			...plugins.map((plugin) =>
				new PluginMetaResult(
					plugin,
					!!config.pluginsEnabled[plugin.id],
				).asHtmlElement(),
			),
		);
	};

	checkboxThemes.addEventListener("change", onFilterChange);
	checkboxResults.addEventListener("change", onFilterChange);

	const settingsLink = FlexContainer({
		gap: "4px",
		alignItems: "center",
		justifyContent: "center",
	});
	settingsLink.append(iconFromString(iconOpenInNew), Span("Settings"));
	settingsLink.style.cursor = "pointer";
	settingsLink.addEventListener("click", () => {
		chrome.tabs.create({ url: "/src/core/views/options/index.html" });
	});
	settingsLink.style.color = "var(--bob-color-primary)";
	document.body.append(settingsLink);
	container.append(
		settingsLink,
		labelThemes,
		labelResults,
		makeAllPluginsCheckbox(config),
	);
	return container;
}

function makeAllPluginsCheckbox(config: BobConfig) {
	const [label, checkbox] = Checkbox(
		coreI18n.t("Disable/Enabled all plugins"),
		PLUGIN_LIST_SUPPORTED.length ===
			PLUGIN_LIST_SUPPORTED.filter((g) => config.pluginsEnabled[g.id])
				.length,
	);

	checkbox.addEventListener("change", async () => {
		const pluginsEnabled: Record<string, boolean> = {};
		for (const plugin of PLUGIN_LIST_SUPPORTED) {
			if (plugin.canBeDisabled) {
				pluginsEnabled[plugin.id] = checkbox.checked;
			}
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

	return label;
}
