import { faviconFromUrl, iconBookmark, iconFromString } from "../../icons";
import { ResultGroup } from "../result-group";
import { Result, type ResultConfig } from "../result/result";

export class ResultGroupBookmarks extends ResultGroup {
	permissions = ["bookmarks"];
	prefix = "b";
	description = "Search & interact with bookmarks.";

	public async getResults(): Promise<Result[]> {
		const tree = await chrome.bookmarks.getTree();
		return this.flattenBookmarksTree(tree);
	}

	private flattenBookmarksTree(tree: chrome.bookmarks.BookmarkTreeNode[]) {
		const results: Result[] = [];
		for (const item of tree) {
			// is item a folder? TODO i dont think folders are relevant, maybe for ui information
			// if(item.dateGroupModified) {
			//     continue
			// }
			if (item.children) {
				results.push(...this.flattenBookmarksTree(item.children));
				continue;
			}

			results.push(new ResultBookmark(item));
		}
		return results;
	}
}

export class ResultBookmark extends Result {
	constructor(private bookmark: chrome.bookmarks.BookmarkTreeNode) {
		super({
			title: bookmark.title,
			description: bookmark.url || "",
			tags: [
				{
					html: iconFromString(iconBookmark, "12px").outerHTML,
				},
			],
			prepend: bookmark.url ? faviconFromUrl(bookmark.url) : undefined,
		});
	}

	public id(): string {
		return this.name() + this.bookmark.id;
	}

	async execute(): Promise<void> {
		if (this.bookmark.url) {
			chrome.tabs.create({ url: this.bookmark.url });
			window.close();
		} else {
			// TODO handle bookmarks with no url?
			console.error("bookmark has no url", this);
		}
	}
}
