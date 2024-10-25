import type { Result } from "../../components/result/result";
import {
	optionsRoot,
	optionsSearchInput,
	resultOptionsContainer,
	resultsContainer,
	resultsCounter,
	selectedResultForOptions,
} from "./dom";
import { filterResults, setCurrentResults } from "./results";
import { newSearch, searchResults } from "./search";
import { getUsageCache } from "./search-data";
import {
	getSelectedResultIndex,
	setLastSelectedResultIndex,
	updateSelectedIndex,
} from "./selected";

let isVisible = false;
let selectedResult: Result;

export function isResultOptionsVisible() {
	return isVisible;
}

export function closeResultOptions() {
	optionsRoot.style.display = "none";
	isVisible = false;
	optionsSearchInput.value = "";
	filterResults();
}

export async function showResultOptions(searchResult: Result) {
	isVisible = true;
	selectedResult = searchResult;
	document.documentElement.style.overflow = "hidden";

	if (!selectedResult?.options) {
		return;
	}
	selectedResultForOptions.innerHTML = searchResult.asHtmlElement().outerHTML;
	setLastSelectedResultIndex(getSelectedResultIndex());
	optionsRoot.style.display = "flex";
	resultOptionsContainer.innerHTML = "";
	resultsContainer.innerHTML = selectedResult.asHtmlElement().outerHTML;
	await selectedResult.options.loadResults();
	filterResultsOptions();
	optionsSearchInput.focus();
}

export async function filterResultsOptions() {
	const usage = await getUsageCache();
	if (!selectedResult?.options) {
		return;
	}
	const resultsFilteredAndSorted = searchResults(
		selectedResult.options.results,
		newSearch(optionsSearchInput),
		usage,
	);

	const elements = resultsFilteredAndSorted.map((item) =>
		item.asHtmlElement(),
	);

	setCurrentResults(resultsFilteredAndSorted);

	resultOptionsContainer.innerHTML = "";
	resultOptionsContainer.append(...elements);

	updateSelectedIndex(0);
	resultsCounter.innerHTML = `${resultOptionsContainer.children.length}/${resultOptionsContainer.children.length} results`;
}

optionsSearchInput?.addEventListener("input", () => {
	filterResultsOptions();
});

window.addEventListener("show-options-for-result", (event) => {
	// @ts-ignore
	if (event.detail) {
		// @ts-ignore
		showResultOptions(event.detail);
	}
});
