import type { Result } from "../../components/result/result";
import { getUsage } from "../../usage";
import {
	optionsSearchInput,
	resultsContainer,
	resultsCounter,
	searchInput,
} from "./dom";
import { isResultOptionsVisible } from "./result-options";
import { newSearch, searchResults } from "./search";
import { getResultGroups, getResults } from "./search-data";
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
	const search = newSearch(
		isResultOptionsVisible() ? optionsSearchInput : searchInput,
	);
	const groupAlone = getResultGroups().find((group) =>
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
	for (const result of currentResults) {
		fragment.appendChild(result.asHtmlElement());
	}

	requestAnimationFrame(() => {
		resultsContainer.innerHTML = "";
		resultsContainer.append(fragment);

		updateSelectedIndex(0);
		resultsCounter.innerHTML = `${resultsContainer.children.length}/${getResults().length} results`;
	});
}

searchInput?.addEventListener("input", () => {
	filterResults();
});
