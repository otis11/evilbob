import { loadCustomTheme } from "../../theme";
import "../../theme";
import "../global.css";
import "./main.css";
import { FlexContainer } from "../../components/flex-container";
import { GroupHeading } from "../../components/group-heading";
import { NumberInput } from "../../components/number-input";
import { type BobConfig, getConfig, updateConfig } from "../../config";
import { LOCALES, type Locale, setLocale } from "../../locales/locales";
import { renderBobDimensions } from "./dimensions";
import { renderFooter } from "./footer";
import { renderHeader } from "./header";
import { renderOnBobWindowEvents } from "./on-bob-window-events";
import { renderPlugins } from "./result-groups";
import { renderThemes } from "./themes";

(async () => {
	const config = await getConfig();
	setLocale(config.locale);
	renderHeader();
	await renderPlugins(config);
	renderSearchOptions(config);
	renderOnBobWindowEvents(config);
	await renderBobDimensions(config);
	renderLocales(config);
	renderThemes(config);
	renderFooter();
	await loadCustomTheme();
})();

function renderLocales(config: BobConfig) {
	const container = FlexContainer({ flexDirection: "column" });
	const select = document.createElement("select");

	select.addEventListener("change", () => {
		updateConfig({
			locale: select.value as Locale,
		});
	});
	for (const locale of LOCALES) {
		const option = document.createElement("option");
		option.innerText = locale;
		option.value = locale;
		select.style.width = "120px";
		if (locale === config.locale) {
			option.selected = true;
		}
		select.append(option);
	}

	container.append(GroupHeading("Locale"), select);
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
	const [labelHeight, inputMaxHistoryItems] = NumberInput({
		value: config.search?.maxHistoryItems?.toString() || "",
		label: "maxHistoryItems",
		description: "Max items that will be loaded from history.",
	});

	inputMaxHistoryItems.addEventListener("input", () => {
		updateConfig({
			search: {
				maxHistoryItems: Number.parseInt(inputMaxHistoryItems.value),
			},
		});
	});

	inputMaxRenderedItems.addEventListener("input", () => {
		updateConfig({
			search: {
				maxRenderedItems: Number.parseInt(inputMaxRenderedItems.value),
			},
		});
	});

	container.append(labelWidth, labelHeight);
	document.body.append(container);
}
