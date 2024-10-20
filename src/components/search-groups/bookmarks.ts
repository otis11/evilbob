import { faviconFromUrl, iconBookmark, iconFromString } from "../../icons";
import { SearchGroup } from "../search-group";
import {
	SearchResult,
	type SearchResultConfig,
} from "../search-result/search-result";

export class SearchGroupBookmarks extends SearchGroup {
	constructor() {
		super({
			name: "bookmarks",
			permissions: ["bookmarks"],
			filter: "!b",
			description: "Search & interact with bookmarks.",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const tree = await chrome.bookmarks.getTree();
		return this.flattenBookmarksTree(tree);
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
					url: item.url,
					tags: [
						{
							html: iconFromString(iconBookmark, "12px")
								.outerHTML,
						},
					],
					prepend: item.url ? faviconFromUrl(item.url) : undefined,
					searchText: `${item.title.toLowerCase()} ${item.url?.toLowerCase() || ""}`,
				}),
			);
		}
		return results;
	}
}

export class SearchResultBookmark extends SearchResult {
	public id: string;
	public url: string | undefined;

	constructor(
		config: { url: string | undefined; id: string } & SearchResultConfig,
	) {
		super(config);
		this.url = config.url;
		this.id = config.id;
	}

	onSelect(): void {
		if (this.url) {
			chrome.tabs.create({ url: this.url });
			window.close();
		} else {
			// TODO handle bookmarks with no url?
			console.error("bookmark has no url", this);
		}
	}
}
