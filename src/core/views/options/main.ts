import { loadTheme } from "../../theme";
import "../../global.css";
import "./main.css";
import { Checkbox } from "../../components/checkbox";
import { FlexContainer } from "../../components/flex-container";
import { GroupHeading } from "../../components/group-heading";
import { NumberInput } from "../../components/number-input/number-input";
import { Select } from "../../components/select";
import { type BobConfig, getConfig, updateConfig } from "../../config";
import { LOCALES, type Locale, coreI18n } from "../../locales";
import { PLUGINS_LOADED, loadPlugins } from "../../plugins";
import { renderBobDimensions } from "./dimensions";
import { renderFooter } from "./footer";
import { renderHeader } from "./header";

(async () => {
	await loadPlugins();
	await loadTheme();
	const config = await getConfig();
	coreI18n.setLocale(config.locale);
	renderHeader();
	renderLocale(config);
	renderTheme(config);
	await renderBobDimensions(config);
	renderSearchOptions(config);
	renderPluginOptions(config);

	renderFooter();
})();

function renderTheme(config: BobConfig) {
	const container = FlexContainer({});

	const themes = Select(
		PLUGINS_LOADED.filter((loaded) => !!loaded.provideTheme).map(
			(plugin) => ({
				title: plugin.name(),
				value: plugin.id || "",
				selected: plugin.id === config.theme,
			}),
		),
	);

	themes.addEventListener("change", () => {
		updateConfig({
			theme: themes.value as Locale,
		});
	});
	container.append(themes);
	document.body.append(GroupHeading("Theme"));
	document.body.append(container);
}

function renderLocale(config: BobConfig) {
	const container = FlexContainer({});

	const locales = Select(
		LOCALES.map((locale) => ({
			title: locale,
			value: locale,
			selected: locale === config.locale,
		})),
	);

	locales.addEventListener("change", () => {
		updateConfig({
			locale: locales.value as Locale,
		});
	});
	container.append(locales);
	document.body.append(GroupHeading("Locale"));
	document.body.append(container);
}

function renderSearchOptions(config: BobConfig) {
	const container = FlexContainer({ flexDirection: "column" });
	container.append(GroupHeading("Search Options"));

	const [labelWidth, inputMaxRenderedItems] = NumberInput({
		value: config.search?.maxRenderedItems?.toString() || "",
		label: "maxRenderedItems",
		description:
			"Max items that will be rendered in the bob command palette. Recommend to keep low, as more items increases the rendering time.",
	});

	inputMaxRenderedItems.addEventListener("input", () => {
		updateConfig({
			search: {
				maxRenderedItems: Number.parseInt(inputMaxRenderedItems.value),
			},
		});
	});

	container.append(labelWidth);
	document.body.append(container);
}

function renderPluginOptions(config: BobConfig) {
	const container = document.createElement("div");
	container.append(GroupHeading("Plugin Options"));
	for (const plugin of PLUGINS_LOADED) {
		const pluginConfig = plugin.provideConfig?.();
		if (pluginConfig) {
			for (const key of Object.keys(pluginConfig)) {
				const obj =
					config.pluginsConfig[plugin.id || ""]?.[key] ||
					pluginConfig[key];
				if (typeof obj.value === "boolean") {
					const [checkbox] = Checkbox(
						`${plugin.name()}: ${obj.value}`,
						false,
						obj.description,
					);
					container.append(checkbox);
				} else if (typeof obj.value === "number") {
					const [label, input] = NumberInput({
						value: obj.value.toString(),
						description: obj.description,
						label: `${plugin.name()}: ${key}`,
					});
					input.addEventListener("input", () => {
						if (plugin.id) {
							updateConfig({
								pluginsConfig: {
									[plugin.id]: {
										[key]: {
											value: Number.parseInt(input.value),
										},
									},
								},
							});
						}
					});
					container.append(label);
				}
			}
		}
	}
	document.body.append(container);
}
