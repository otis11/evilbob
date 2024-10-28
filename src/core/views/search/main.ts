import { type BobConfig, getConfig, onConfigUpdate } from "../../config";
import "../../theme";
import "../../global.css";
import { renderFooter } from "./footer";
import "./main.css";
import { filterResults } from "./results";
import { loadFreshData } from "./search-data";
import "./keyboard";
import "./mouse";
import { type Locale, coreI18n } from "../../locales";
import { PLUGINS_LOADED, loadPlugins } from "../../plugins";
import { loadTheme } from "../../theme";
import { optionsSearchInput, searchInput } from "./dom";
import {
	getOptionsSelectedResult,
	isResultOptionsVisible,
} from "./result-options";

let config: BobConfig;

function windowState() {
	return {
		win: window,
		input: searchInput,
		optionsInput: optionsSearchInput,
		isOptionsVisible: isResultOptionsVisible(),
		optionsSelectedResult: getOptionsSelectedResult(),
		locale: "en-US" as Locale,
	};
}

getConfig().then(async (cfg) => {
	await loadPlugins();
	await loadTheme();

	config = cfg;
	coreI18n.setLocale(config.locale);

	for (const plugin of PLUGINS_LOADED) {
		plugin.onBobWindowOpen?.(windowState());
	}

	loadFreshData().then(() => {
		filterResults();
	});

	renderFooter();
});

onConfigUpdate((cfg) => {
	// plugins need to be reloaded
	window.location.reload();
});

window.addEventListener("blur", async () => {
	for (const plugin of PLUGINS_LOADED) {
		plugin.onBobWindowBlur?.(windowState());
	}
});

window.addEventListener("focus", async () => {
	for (const plugin of PLUGINS_LOADED) {
		plugin.onBobWindowFocus?.(windowState());
	}
	// TOOD
	// if (config.onBobWindowFocus?.refreshResults) {
	// 	await loadFreshData();
	// }

	filterResults();
});
