import "../themes";
import "../global.css";
import "./main.css";
import type { SearchGroup } from "../components/search-group";
import { SearchResult } from "../components/search-result";
import { SearchResultGroups } from "../search-groups";

const searchResultGroups: SearchResultGroups = new SearchResultGroups();
let selectedSearchResultIndex = 0;
let filteredSearchElements: HTMLElement[] = [];
let lastMousePosition = {
	x: 0,
	y: 0,
};

const searchInput = document.getElementById("search") as HTMLInputElement;
const resultsContainer = document.getElementById("results") as HTMLElement;

function filterSearchResults() {
	const searchString = searchInput?.value;
	// TODO improve search, Levenshtein distance algorithm? what is good?
	for (const child of Array.from(resultsContainer.children)) {
		const instance = SearchResult.instanceFromId(
			child.getAttribute("data-instance-id") || "",
		);
		const isHit = instance?.searchText
			.toLowerCase()
			.includes(searchString.toLowerCase());
		if (isHit) {
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

	if (searchResultGroups.list.length === 0) {
		const button = document.createElement("button");
		button.addEventListener("click", () =>
			chrome.runtime.openOptionsPage(),
		);
		button.innerText = "Go to options";
		const container = document.createElement("div");
		container.classList.add("no-results");
		const text = document.createElement("span");
		text.innerText = "Looks like no search group is enabled. :O";

		container.append(text, button);
		resultsContainer.append(container);
		return;
	}

	for (const group of searchResultGroups.list) {
		resultsContainer.append(...group.asHtmlElement());
	}

	filteredSearchElements = Array.from(
		resultsContainer.querySelectorAll<HTMLElement>("li:not(.hidden)"),
	);
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
		showSelectedIndex(true);
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
		showSelectedIndex(true);
	}
	if (event.key === "Enter") {
		const target = filteredSearchElements[selectedSearchResultIndex];
		const searchResult = SearchResult.instanceFromId(
			target?.getAttribute("data-instance-id") || "",
		);
		console.log(searchResult, event, target);
	}
}

function onKeyDown(event: KeyboardEvent) {
	if (event.key === "ArrowDown" || event.key === "ArrowUp") {
		event.preventDefault();
	}
}

function showSelectedIndex(scrollTo = false) {
	const el = filteredSearchElements[selectedSearchResultIndex];
	if (!el) {
		return;
	}
	el.setAttribute("aria-selected", "");
	if (scrollTo) {
		el.scrollIntoView({
			behavior: "smooth",
		});
	}
}

function removeHighlightSelectedIndex() {
	for (const el of Array.from(
		resultsContainer.querySelectorAll("[aria-selected"),
	)) {
		el.removeAttribute("aria-selected");
	}
}

searchInput?.addEventListener("input", filterSearchResults);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
searchInput?.focus();

window.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		window.close();
	}
});

window.addEventListener("mouseover", (event) => {
	// ignore mouseover if mouse stood still
	if (
		lastMousePosition.x === event.clientX &&
		lastMousePosition.y === event.clientY
	) {
		return;
	}

	lastMousePosition = {
		x: event.clientX,
		y: event.clientY,
	};

	const target = getLiFromEvent(event);
	if (target) {
		removeHighlightSelectedIndex();
		const index = filteredSearchElements.indexOf(target);
		selectedSearchResultIndex = index;
		showSelectedIndex();
	}
});

function getLiFromEvent(event: Event) {
	if (!(event.target instanceof HTMLElement)) {
		return null;
	}
	if (event.target.tagName === "LI") {
		return event.target;
	}
	return event.target.closest("li");
}

(async () => {
	await searchResultGroups.filterEnabled();
	await searchResultGroups.order();
	const promises = searchResultGroups.list.map((group) =>
		group.loadResults(),
	);
	await Promise.all(promises);
	renderSearchResults();
})();
