import { faviconFromUrl, iconBookmark, iconFromString } from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";

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
		this.options = new ResultBookmarkOptions(this.bookmark);
	}

	public id(): string {
		return this.name() + this.bookmark.id;
	}

	async execute(): Promise<void> {
		if (this.bookmark.url) {
			chrome.tabs.create({ url: this.bookmark.url });
			focusLastActiveWindow();
		} else {
			// TODO handle bookmarks with no url?
			console.error("bookmark has no url", this);
		}
	}
}

class ResultBookmarkOptions extends ResultGroup {
	constructor(private bookmark: chrome.bookmarks.BookmarkTreeNode) {
		super();
	}

	public async getResults(): Promise<Result[]> {
		return [new ResultRemoveBookmark(this.bookmark)];
	}
}

class ResultRemoveBookmark extends Result {
	constructor(private bookmark: chrome.bookmarks.BookmarkTreeNode) {
		super({
			title: "Remove",
			description: "Remove bookmark. Delete",
		});
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		await chrome.bookmarks.remove(this.bookmark.id);
		focusLastActiveWindow();
	}
}
