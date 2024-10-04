import "../themes";
import "../global.css";
import type { SearchResultGroup } from "../search/search-result-group";
import { getSearchGroupsWithPermission } from "../search/search-result-groups";

let searchResultGroups: SearchResultGroup[] = [];
let selectedSearchResultIndex = 0;
let filteredSearchElements: HTMLElement[] = [];

const searchInput = document.getElementById("search") as HTMLInputElement;
const resultsContainer = document.getElementById("results") as HTMLElement;

function filterSearchResults() {
	const searchString = searchInput?.value;
	// TODO improve search, Levenshtein distance algorithm? what is good?
	for (const child of Array.from(resultsContainer.children)) {
		if (
			child
				.getAttribute("data-search")
				?.includes(searchString.toLowerCase())
		) {
			child.classList.remove("hidden");
		} else {
			child.classList.add("hidden");
		}
	}
	filteredSearchElements = Array.from(
		resultsContainer.querySelectorAll<HTMLElement>("li:not(.hidden)"),
	);
	removeHighlightSelectedIndex();
	selectedSearchResultIndex = 0;
	showSelectedIndex();
}

function renderSearchResults() {
	if (!resultsContainer) {
		console.error("no results container found");
		return;
	}

	resultsContainer.innerHTML = "";

	for (const group of searchResultGroups) {
		resultsContainer.append(...group.asHtmlElement());
	}

	showSelectedIndex();
}

function onKeyUp(event: KeyboardEvent) {
	if (event.key === "ArrowDown") {
		removeHighlightSelectedIndex();
		if (selectedSearchResultIndex === filteredSearchElements.length - 1) {
			selectedSearchResultIndex = 0;
		} else {
			selectedSearchResultIndex += 1;
		}
		showSelectedIndex();
	}
	if (event.key === "ArrowUp") {
		removeHighlightSelectedIndex();
		if (
			selectedSearchResultIndex === 0 ||
			selectedSearchResultIndex === -1
		) {
			selectedSearchResultIndex = filteredSearchElements.length - 1;
		} else {
			selectedSearchResultIndex -= 1;
		}
		showSelectedIndex();
	}
	if (event.key === "Enter") {
	}
}

function onKeyDown(event: KeyboardEvent) {
	if (event.key === "ArrowDown" || event.key === "ArrowUp") {
		event.preventDefault();
	}
}

function showSelectedIndex() {
	filteredSearchElements[selectedSearchResultIndex].setAttribute(
		"aria-selected",
		"",
	);
	filteredSearchElements[selectedSearchResultIndex].scrollIntoView({
		behavior: "smooth",
	});
}

function removeHighlightSelectedIndex() {
	filteredSearchElements[selectedSearchResultIndex].removeAttribute(
		"aria-selected",
	);
}

searchInput?.addEventListener("input", filterSearchResults);
searchInput?.addEventListener("keydown", onKeyDown);
searchInput?.addEventListener("keyup", onKeyUp);
searchInput?.focus();

window.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		window.close();
	}
});

(async () => {
	searchResultGroups = await getSearchGroupsWithPermission();
	const promises = searchResultGroups.map((group) => group.loadResults());
	await Promise.all(promises);
	renderSearchResults();
})();
