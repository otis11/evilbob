import { SearchGroup } from "../components/search-group";
import {
	SearchResult,
	type SearchResultConfig,
} from "../components/search-result";
import { iconBookmark } from "../icons";

export class SearchGroupBookmarks extends SearchGroup {
	constructor() {
		super({
			name: "bookmarks",
			permissions: ["bookmarks"],
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
					searchText: `${item.title.toLowerCase()} ${item.url?.toLowerCase() || ""}`,
				}),
			);
		}
		return results;
	}
}

export class SearchResultBookmark extends SearchResult {
	public id: string;

	constructor(config: { id: string } & SearchResultConfig) {
		super(config);
		this.id = config.id;
	}

	onSelect(): void {
		console.log("bookmark selected");
	}
}
