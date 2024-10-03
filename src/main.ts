import { bobConfig } from "./config";

const searchResults: SearchResult[] = [];
let selectedSearchResultIndex = 0;

type SearchResult = {
	type: "bookmark";
	title: string;
	description: string;
	id: string;
	searchText: string;
};

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
	const firstResultNotHidden =
		resultsContainer.querySelector("li:not(.hidden)");
	removeHighlightSelectedIndex();
	selectedSearchResultIndex = Number.parseInt(
		firstResultNotHidden?.getAttribute("data-index") || "0",
	);
	showSelectedIndex();
}

function flattenBookmarksTree(tree: chrome.bookmarks.BookmarkTreeNode[]) {
	const results: SearchResult[] = [];
	for (const item of tree) {
		if (item.children) {
			results.push(...flattenBookmarksTree(item.children));
		}
		results.push({
			title: item.title,
			description: item.url || "",
			id: item.id,
			type: "bookmark",
			searchText:
				item.title.toLowerCase() + (item.url?.toLowerCase() || ""),
		});
	}
	return results;
}

function renderSearchResults() {
	if (!resultsContainer) {
		console.error("no results container found");
		return;
	}

	resultsContainer.innerHTML = "";

	for (const [index, result] of searchResults.entries()) {
		const li = document.createElement("li");
		li.classList.add("result");
		li.setAttribute("data-type", result.type);
		li.setAttribute("data-id", result.id);
		li.setAttribute("data-search", result.searchText);
		li.setAttribute("data-index", index.toString());

		const title = document.createElement("div");
		title.classList.add("result-title");
		title.innerText = result.title;

		const description = document.createElement("div");
		description.classList.add("result-description");
		description.innerText = result.description;

		li.append(title, description);

		resultsContainer.append(li);
	}

	showSelectedIndex();
}

function onKeyUp(event: KeyboardEvent) {
	if (event.key === "ArrowDown") {
		removeHighlightSelectedIndex();
		if (
			selectedSearchResultIndex ===
			resultsContainer.children.length - 1
		) {
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
			selectedSearchResultIndex = resultsContainer.children.length - 1;
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
	resultsContainer.children[selectedSearchResultIndex].setAttribute(
		"aria-selected",
		"",
	);
	resultsContainer.children[selectedSearchResultIndex].scrollIntoView({
		behavior: "smooth",
	});
}

function removeHighlightSelectedIndex() {
	resultsContainer.children[selectedSearchResultIndex].removeAttribute(
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

if (bobConfig.search.bookmarks.enabled) {
	chrome.bookmarks.getTree().then((tree) => {
		searchResults.push(...flattenBookmarksTree(tree));
		renderSearchResults();
	});
}
