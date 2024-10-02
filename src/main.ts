import { bobConfig } from "./config";

const searchResultGroups: SearchResultGroup[] = [];

type SearchResultGroup = {
	title: string;
	results: SearchResult[];
};

type SearchResult = {
	type: "bookmark";
	title: string;
	description: string;
	id: string;
	searchText: string;
};

const searchInput = document.getElementById(
	"search",
) as HTMLInputElement | null;
const resultsContainer = document.getElementById("results");

function filterSearchResults() {
	const searchString = searchInput?.value;
	// TODO improve search, Levenshtein distance algorithm? what is good?
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

	for (const group of searchResultGroups) {
		const div = document.createElement("div");
		div.classList.add("result-group-title");
		div.innerText = group.title;
		resultsContainer.append(div);

		for (const result of group.results) {
			const li = document.createElement("li");
			li.classList.add("result");
			li.setAttribute("data-type", result.type);
			li.setAttribute("data-id", result.id);
			li.setAttribute("data-search", result.searchText);

			const title = document.createElement("div");
			title.classList.add("result-title");
			title.innerText = result.title;

			const description = document.createElement("div");
			description.classList.add("result-description");
			description.innerText = result.description;

			li.append(title, description);

			resultsContainer.append(li);
		}
	}
}

searchInput?.addEventListener("input", filterSearchResults);
searchInput?.focus();

window.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		window.close();
	}
});

if (bobConfig.search.bookmarks.enabled) {
	chrome.bookmarks.getTree().then((tree) => {
		searchResultGroups.push({
			title: "Bookmarks",
			results: flattenBookmarksTree(tree),
		});
		renderSearchResults();
	});
}
