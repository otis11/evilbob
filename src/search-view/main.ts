import "../themes";
import "../global.css";
import "./main.css";
import packageJson from "../../package.json";
import { Search } from "../components/search";
import { SearchResult } from "../components/search-result";
import { iconCog, iconFromString, iconLoading, iconReload } from "../icons";
import { browserName, browserVersion } from "../platform";
import { SearchGroups } from "../search-groups";

const searchResultGroups: SearchGroups = new SearchGroups();
let selectedSearchResultIndex = 0;
let filteredSearchElements: HTMLElement[] = [];
let lastMousePosition = {
	x: 0,
	y: 0,
};

const searchInput = document.getElementById("search") as HTMLInputElement;
const resultsContainer = document.getElementById("results") as HTMLElement;
const statusStripe = document.getElementById("status-stripe") as HTMLElement;

function filterSearchResults() {
	const search = new Search({
		inputElement: searchInput,
		text: searchInput?.value || "",
		selectionStart: searchInput.selectionStart,
	});
	// TODO improve search, Levenshtein distance algorithm? what is good?

	const groupAlone = searchResultGroups.list.find((group) =>
		group.shouldRenderAlone(search),
	);
	if (groupAlone) {
		for (const group of searchResultGroups.list) {
			group.hideRenderedNodes();
		}
		groupAlone.filterRenderedNodes(search);
	} else {
		for (const group of searchResultGroups.list) {
			group.filterRenderedNodes(search);
		}
	}

	filteredSearchElements = Array.from(
		resultsContainer.querySelectorAll<HTMLElement>("li:not(.hidden)"),
	);
	removeHighlightSelectedIndex();
	selectedSearchResultIndex = 0;
	showSelectedIndex();
}

export function renderFooter() {
	const footer = document.getElementById("footer");

	const browser = document.createElement("span");
	browser.innerText = `${browserName} ${browserVersion}`;

	const bobVersion = document.createElement("span");
	bobVersion.innerText = `Bob ${packageJson.version}`;

	const reload = iconFromString(iconReload, "16px");
	reload.addEventListener("click", () => {
		loadFreshSearchResults();
	});

	const settings = iconFromString(iconCog, "16px");
	settings.addEventListener("click", () => {
		chrome.runtime.openOptionsPage();
	});

	const spacer = document.createElement("span");
	spacer.classList.add("spacer");

	footer?.append(bobVersion, browser, spacer, reload, settings);
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
		if (!group.isResultsLoaded) {
			continue;
		}
		resultsContainer.append(...group.asHtmlElement());
	}

	filteredSearchElements = Array.from(
		resultsContainer.querySelectorAll<HTMLElement>("li:not(.hidden)"),
	);
	filterSearchResults();
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
		const search = new Search({
			inputElement: searchInput,
			selectionStart: searchInput.selectionStart,
			text: searchInput.value,
		});
		searchResult?.onSelect(search);
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
window.addEventListener("click", (event) => {
	const target = getLiFromEvent(event);
	if (target) {
		const searchResult = SearchResult.instanceFromId(
			target?.getAttribute("data-instance-id") || "",
		);
		const search = new Search({
			inputElement: searchInput,
			selectionStart: searchInput.selectionStart,
			text: searchInput.value,
		});
		searchResult?.onSelect(search);
	}
});
searchInput?.focus();

window.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		window.close();
	}
});

window.addEventListener("focus", () => {
	searchInput.focus();
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

async function loadFreshSearchResults() {
	await searchResultGroups.filterEnabled();
	await searchResultGroups.order();
	for (const group of searchResultGroups.list) {
		group.loadResults().then((results) => {
			const notLoaded = searchResultGroups.list.filter(
				(group) => !group.isResultsLoaded,
			);
			statusStripe.innerHTML = "";
			if (notLoaded.length > 0) {
				const icon = iconFromString(iconLoading);
				icon.classList.add("rotate-animation");
				const text = notLoaded.map((group) => group.name).join(", ");
				statusStripe.append(icon, text);
				renderSearchResults();
			}
		});
	}
}

renderFooter();
loadFreshSearchResults();
