import { iconBookmark } from "../icons";
import { SearchResult } from "./search-result";
import { SearchResultGroup } from "./search-result-group";

export class SearchResultGroupBookmarks extends SearchResultGroup {
	constructor() {
		super({
			name: "bookmarks",
			permissions: ["bookmarks"],
			icon: iconBookmark,
			shortcut: ["Ctrl", "Shift", "O"],
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		return new Promise((resolve) => {
			chrome.bookmarks.getTree().then((tree) => {
				resolve(this.flattenBookmarksTree(tree));
			});
		});
	}

	private flattenBookmarksTree(tree: chrome.bookmarks.BookmarkTreeNode[]) {
		const results: SearchResult[] = [];
		for (const item of tree) {
			// is item a folder? TODO i dont think folders are relevant, maybe for ui information
			// if(item.dateGroupModified) {
			//     continue
			// }
			if (item.children) {
				results.push(...this.flattenBookmarksTree(item.children));
				continue;
			}

			results.push(
				new SearchResultBookmark({
					title: item.title,
					description: item.url || "",
					id: item.id,
					icon: iconBookmark,
					searchText:
						item.title.toLowerCase() +
						(item.url?.toLowerCase() || ""),
				}),
			);
		}
		return results;
	}
}

export class SearchResultBookmark extends SearchResult {
	onSelect(): void {
		console.log("bookmark selected");
	}
}
