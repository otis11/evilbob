import type { Result } from "../../components/result/result";
import { getConfig } from "../../config";
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
	let latest = performance.now();
	console.log("filter start");
	const usage = await getUsage();
	const config = await getConfig();
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
	console.log("after js serach", (performance.now() - latest).toFixed(1));
	latest = performance.now();

	const fragment = document.createDocumentFragment();
	const threshold = config.search?.maxRenderedItems || 35;
	for (let i = 0; i < currentResults.length; i++) {
		if (i > threshold) {
			break;
		}
		fragment.appendChild(currentResults[i].asHtmlElement());
	}

	requestAnimationFrame(() => {
		resultsContainer.innerHTML = "";
		resultsContainer.append(fragment);

		updateSelectedIndex(0);
		resultsCounter.innerHTML = `${resultsContainer.children.length}/${getResults().length} results`;
		requestAnimationFrame(() => {
			console.log(
				"after render",
				(performance.now() - latest).toFixed(1),
			);
		});
	});
}

searchInput?.addEventListener("input", () => {
	filterResults();
});
