import { type BobConfig, getConfig } from "../../config";
import "../../theme";
import "../global.css";
import { renderFooter } from "./footer";
import "./main.css";
import { filterResults } from "./results";
import { loadFreshData } from "./search-data";
import "./keyboard";
import "./mouse";
import { optionsSearchInput, searchInput } from "./dom";
import { isResultOptionsVisible } from "./result-options";

let config: BobConfig;
getConfig().then((cfg) => {
	config = cfg;
});
loadFreshData().then(() => {
	filterResults();
});

(isResultOptionsVisible() ? optionsSearchInput : searchInput).focus();
window.addEventListener("focus", () => {
	(isResultOptionsVisible() ? optionsSearchInput : searchInput).focus();
});

renderFooter();
