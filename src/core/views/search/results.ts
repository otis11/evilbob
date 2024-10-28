import type { Result } from "../../components/result/result";
import { getConfig } from "../../config";
import { coreI18n } from "../../locales";
import { PLUGINS_LOADED_PROVIDE_RESULTS } from "../../plugins";
import { getUsage } from "../../usage";
import {
	optionsSearchInput,
	resultsContainer,
	resultsCounter,
	searchInput,
} from "./dom";
import { isResultOptionsVisible } from "./result-options";
import { newSearch, searchResults } from "./search";
import { getPluginResults } from "./search-data";
import { updateSelectedIndex } from "./selected";

let currentResults: Result[] = [];

export function getCurrentResults() {
	return currentResults;
}

export function setCurrentResults(newResults: Result[]) {
	currentResults = newResults;
}

export async function filterResults() {
	const usage = await getUsage();
	const config = await getConfig();
	const search = newSearch(
		isResultOptionsVisible() ? optionsSearchInput : searchInput,
	);
	const pluginAloneIndex = PLUGINS_LOADED_PROVIDE_RESULTS.findIndex(
		(plugin) => !!plugin.prefix && search.words()[0] === plugin.prefix,
	);

	currentResults = [];
	if (pluginAloneIndex > -1) {
		const searchWithoutPrefix = newSearch(
			isResultOptionsVisible() ? optionsSearchInput : searchInput,
			search.words().slice(1).join(" "),
		);
		currentResults = searchResults(
			getPluginResults()[pluginAloneIndex],
			searchWithoutPrefix,
			usage,
		);
	} else {
		currentResults = searchResults(
			getPluginResults().flat(),
			search,
			usage,
		);
	}

	const fragment = document.createDocumentFragment();
	const threshold = config.search?.maxRenderedItems || 25;
	for (let i = 0; i < currentResults.length; i++) {
		if (i >= threshold) {
			break;
		}
		fragment.appendChild(currentResults[i].asHtmlElement());
	}

	requestAnimationFrame(() => {
		resultsContainer.innerHTML = "";
		resultsContainer.append(fragment);

		updateSelectedIndex(0);
		resultsCounter.innerText = `${resultsContainer.children.length}/${getPluginResults().flat().length} ${coreI18n.t("Results")}`;
	});
}

searchInput?.addEventListener("input", () => {
	filterResults();
});
