import type { Result } from "../../components/result/result";
import { coreI18n } from "../../locales";
import { getUsage } from "../../usage";
import {
	optionsRoot,
	optionsSearchInput,
	resultOptionsContainer,
	resultsContainer,
	resultsCounter,
	searchInput,
	selectedResultForOptions,
} from "./dom";
import { bobWindowState } from "./main.ts";
import { filterResults, setCurrentResults } from "./results";
import { newSearch, searchResults } from "./search";
import {
	getLastSelectedResultIndex,
	getSelectedResultIndex,
	setLastSelectedResultIndex,
	updateSelectedIndex,
} from "./selected";

let isVisible = false;
const selectedResultHistory: Result[] = [];

export function isResultOptionsVisible() {
	return isVisible;
}

export function getOptionsSelectedResult() {
	return selectedResultHistory.at(-1);
}

export async function closeResultOptions() {
	selectedResultHistory.pop();
	optionsSearchInput.value = "";
	const resultBefore = selectedResultHistory.at(-1);
	console.log(selectedResultHistory, "history pls");
	if (selectedResultHistory.length > 0 && resultBefore) {
		await showResultOptions(resultBefore, false);
		return;
	}
	optionsRoot.style.display = "none";
	isVisible = false;
	await filterResults();
	updateSelectedIndex(getLastSelectedResultIndex());
	searchInput?.focus();
	document.documentElement.style.overflow = "unset";
}

export async function showResultOptions(
	searchResult: Result,
	addToHistory = true,
) {
	if (!searchResult?.options) {
		return;
	}

	isVisible = true;
	document.documentElement.style.overflow = "hidden";
	if (addToHistory) {
		selectedResultHistory.push(searchResult);
	}
	selectedResultForOptions.innerHTML = selectedResultHistory
		.map((r) => r.asHtmlElement().outerHTML)
		.join("");
	setLastSelectedResultIndex(getSelectedResultIndex());
	optionsRoot.style.display = "flex";
	resultOptionsContainer.innerHTML = "";
	resultsContainer.innerHTML = searchResult.asHtmlElement().outerHTML;
	console.log("hi", searchResult);
	searchResult.onOptionsOpen(bobWindowState());
	await filterResultsOptions();
	optionsSearchInput.focus();
}

export async function filterResultsOptions() {
	const selectedResult = getOptionsSelectedResult();
	const usage = await getUsage();
	if (!selectedResult?.options) {
		return;
	}
	const options = selectedResult.options();
	if (options) {
		const resultsFilteredAndSorted = searchResults(
			options,
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
		resultsCounter.innerText = `${resultOptionsContainer.children.length}/${resultOptionsContainer.children.length} ${coreI18n.t("Results")}`;
	}
}

optionsSearchInput?.addEventListener("input", async () => {
	await filterResultsOptions();
});

window.addEventListener("show-options-for-result", async (event) => {
	// @ts-expect-error this event is a custom event which has a Result class in .detail.
	if (event.detail) {
		// @ts-ignore
		await showResultOptions(event.detail);
	}
});
