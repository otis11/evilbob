import { bobConfig } from "./config";

const searchResults = [];

type SearchResult = {
	type: "bookmark";
	title: string;
	id: string;
};

const bob = document.getElementById("bob");
const bobInput = bob?.querySelector("input");

bobInput?.focus();

window.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		window.close();
	}
});

if (bobConfig.search.bookmarks.enabled) {
	chrome.bookmarks.getTree().then((tree) => {
		console.log(flattenBookmarksTree(tree));
	});
}

function flattenBookmarksTree(tree: chrome.bookmarks.BookmarkTreeNode[]) {
	const results: SearchResult[] = [];
	for (const item of tree) {
		if (item.children) {
			results.push(...flattenBookmarksTree(item.children));
		}
		results.push({
			title: item.title,
			id: item.id,
			type: "bookmark",
		});
	}
	return results;
}
