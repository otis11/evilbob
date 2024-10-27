import { type BobConfig, getConfig, onConfigUpdate } from "../../config";
import "../../theme";
import "../global.css";
import { renderFooter } from "./footer";
import "./main.css";
import { filterResults } from "./results";
import { loadFreshData } from "./search-data";
import "./keyboard";
import "./mouse";
import { setLocale } from "../../locales/locales";
import { optionsSearchInput, searchInput } from "./dom";
import { isResultOptionsVisible } from "./result-options";

let config: BobConfig;
getConfig().then((cfg) => {
	config = cfg;
	setLocale(config.locale);
	loadFreshData().then(() => {
		filterResults();
	});

	renderFooter();
});

onConfigUpdate((cfg) => {
	config = cfg;
	loadFreshData().then(() => {
		filterResults();
	});
});

(isResultOptionsVisible() ? optionsSearchInput : searchInput).focus();
window.addEventListener("blur", async () => {
	if (config.onBobWindowLeave?.closeWindow) {
		window.close();
		return;
	}

	if (config.onBobWindowLeave?.clearSearch) {
		searchInput.value = "";
	}
});

window.addEventListener("focus", async () => {
	(isResultOptionsVisible() ? optionsSearchInput : searchInput).focus();
	if (config.onBobWindowFocus?.refreshResults) {
		await loadFreshData();
	}

	filterResults();
});
