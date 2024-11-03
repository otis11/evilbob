import { type BobConfig, getConfig, onConfigUpdate } from "../../config";
import "../../theme";
import "../../global.css";
import { renderFooter } from "./footer";
import "./main.css";
import { filterResults, getCurrentResults } from "./results";
import { loadFreshData } from "./search-data";
import "./keyboard";
import "./mouse";
import { type Locale, coreI18n } from "../../locales";
import { PLUGINS_LOADED, loadPlugins } from "../../plugins";
import { loadTheme } from "../../theme";
import { optionsSearchInput, searchInput } from "./dom";
import {
	closeResultOptions,
	getOptionsSelectedResult,
	isResultOptionsVisible,
} from "./result-options";
import { newSearch } from "./search";

let config: BobConfig;

export function bobWindowState() {
	return {
		win: window,
		input: searchInput,
		currentSearch: newSearch(
			isResultOptionsVisible() ? optionsSearchInput : searchInput,
		),
		optionsInput: optionsSearchInput,
		isOptionsVisible: isResultOptionsVisible(),
		optionsSelectedResult: getOptionsSelectedResult(),
		locale: "en-US" as Locale,
		closeResultOptions,
		results: getCurrentResults(),
	};
}

getConfig().then(async (cfg) => {
	await loadPlugins();
	await loadTheme();

	config = cfg;
	coreI18n.setLocale(config.locale);

	for (const plugin of PLUGINS_LOADED) {
		plugin.onBobWindowOpen?.(bobWindowState());
	}

	loadFreshData().then(() => {
		filterResults();
	});

	await renderFooter();
});

onConfigUpdate(() => {
	// plugins need to be reloaded
	window.location.reload();
});

window.addEventListener("blur", async () => {
	for (const plugin of PLUGINS_LOADED) {
		plugin.onBobWindowBlur?.(bobWindowState());
	}
});

window.addEventListener("focus", async () => {
	for (const plugin of PLUGINS_LOADED) {
		plugin.onBobWindowFocus?.(bobWindowState());
	}
	await loadFreshData();
	await filterResults();
});
