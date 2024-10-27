import { faviconFromUrl, iconBookmark, iconFromString } from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";
import type { Tag } from "../tags/tags";

export class Bookmarks extends ResultGroup {
	permissions = ["bookmarks"];
	prefix = "b";
	public description(): string {
		return "Search & interact with bookmarks.";
	}
	public id(): string {
		return "bookmarks";
	}

	public name(): string {
		return "Bookmarks";
	}

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

			results.push(new Bookmark(item));
		}
		return results;
	}
}

export class Bookmark extends Result {
	title(): string {
		return this.bookmark.title;
	}

	description(): string {
		return this.bookmark.url || "";
	}

	tags(): Tag[] {
		return [
			{
				html: iconFromString(iconBookmark, "12px").outerHTML,
			},
		];
	}

	prepend(): HTMLElement | undefined {
		return this.bookmark.url
			? faviconFromUrl(this.bookmark.url)
			: undefined;
	}

	options(): ResultGroup {
		return new BookmarkOptions(this.bookmark);
	}

	constructor(private bookmark: chrome.bookmarks.BookmarkTreeNode) {
		super();
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

class BookmarkOptions extends ResultGroup {
	public id(): string {
		return "bookmark-options";
	}
	constructor(private bookmark: chrome.bookmarks.BookmarkTreeNode) {
		super();
	}
	public description(): string {
		return "";
	}
	public name(): string {
		return "Bookmark Options";
	}

	public async getResults(): Promise<Result[]> {
		return [new RemoveBookmark(this.bookmark)];
	}
}

class RemoveBookmark extends Result {
	title(): string {
		return "Remove";
	}
	description(): string {
		return "Remove bookmark. Delete";
	}

	constructor(private bookmark: chrome.bookmarks.BookmarkTreeNode) {
		super();
	}

	public async execute(search: Search, results: Result[]): Promise<void> {
		await chrome.bookmarks.remove(this.bookmark.id);
		focusLastActiveWindow();
	}
}
