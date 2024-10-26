import { type BobConfig, getConfig } from "../../config";
import "../../theme";
import "../global.css";
import { renderFooter } from "./footer";
import "./main.css";
import { filterResults } from "./results";
import { loadFreshData } from "./search-data";
import "./keyboard";
import "./mouse";
import { setLocale } from "../../locale";
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

(isResultOptionsVisible() ? optionsSearchInput : searchInput).focus();
window.addEventListener("blur", async () => {
	if (config.onBobWindowLeave?.closeWindow) {
		window.close();
		return;
	}

	if (config.onBobWindowLeave?.clearSearch) {
		searchInput.value = "";
	}

	if (config.onBobWindowLeave?.refreshResults) {
		await loadFreshData();
	}

	filterResults();
});

window.addEventListener("focus", () => {
	(isResultOptionsVisible() ? optionsSearchInput : searchInput).focus();
});
