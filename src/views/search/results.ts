import type { Result } from "../../components/result/result";
import { getConfigCache } from "./config-cache";
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

export async function filterResults() {
	const config = await getConfigCache();
	const search = newSearch(
		isResultOptionsVisible() ? optionsSearchInput : searchInput,
	);
	const groupAlone = getResultGroups().find((group) =>
		group.shouldRenderAlone(search),
	);

	let resultsFilteredAndSorted: Result[] = [];
	if (groupAlone) {
		const searchWithoutPrefix = newSearch(
			isResultOptionsVisible() ? optionsSearchInput : searchInput,
			search.words().slice(1).join(" "),
		);
		console.log(searchWithoutPrefix, search.words().slice(1).join(" "));
		resultsFilteredAndSorted = searchResults(
			groupAlone.results,
			searchWithoutPrefix,
			config,
		);
	} else {
		resultsFilteredAndSorted = searchResults(getResults(), search, config);
	}

	const elements = resultsFilteredAndSorted.map((item) =>
		item.asHtmlElement(),
	);

	resultsContainer.innerHTML = "";
	resultsContainer.append(...elements);

	updateSelectedIndex(0);
	resultsCounter.innerHTML = `${resultsContainer.children.length}/${getResults().length} results`;
}

searchInput?.addEventListener("input", () => {
	filterResults();
});
