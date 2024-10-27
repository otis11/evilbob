import type { Result } from "../../components/result/result";
import { getConfig } from "../../config";
import { t } from "../../locales/locales";
import { getUsage } from "../../usage";
import {
	optionsSearchInput,
	resultsContainer,
	resultsCounter,
	searchInput,
} from "./dom";
import { isResultOptionsVisible } from "./result-options";
import { newSearch, searchResults } from "./search";
import { getPlugins, getResults } from "./search-data";
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
	const groupAlone = getPlugins().find((group) =>
		group.shouldRenderAlone(search),
	);

	currentResults = [];
	if (groupAlone) {
		const searchWithoutPrefix = newSearch(
			isResultOptionsVisible() ? optionsSearchInput : searchInput,
			search.words().slice(1).join(" "),
		);
		currentResults = searchResults(
			groupAlone.results,
			searchWithoutPrefix,
			usage,
		);
	} else {
		currentResults = searchResults(getResults(), search, usage);
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
		resultsCounter.innerText = `${resultsContainer.children.length}/${getResults().length} ${t("Results")}`;
	});
}

searchInput?.addEventListener("input", () => {
	filterResults();
});
