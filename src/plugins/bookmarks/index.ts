import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import { NewResult } from "../../core/components/result/simpe-result.ts";
import { Search } from "../../core/components/search.ts";
import type { Tag } from "../../core/components/tags/tags";
import {
	faviconFromUrl,
	iconBookmark,
	iconFolder,
	iconFormatTitle,
	iconFromString,
} from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import { focusLastActiveWindow } from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	permissions: ["bookmarks"],
	prefix: "b",
	description() {
		return t("Bookmarks.description");
	},

	name(): string {
		return t("Bookmarks");
	},

	async provideResults(): Promise<Result[]> {
		const tree = await chrome.bookmarks.getTree();
		const folders = flattenBookmarksTreeFoldersOnly(tree);
		return flattenBookmarksTree(tree, folders);
	},
	onLocalChange(locale) {
		setLocale(locale);
	},
	icon: iconBookmark,
});

function flattenBookmarksTree(
	tree: chrome.bookmarks.BookmarkTreeNode[],
	folders: chrome.bookmarks.BookmarkTreeNode[],
) {
	const results: Result[] = [];
	for (const item of tree) {
		// is item a folder?
		// if(item.dateGroupModified) {
		//     continue
		// }
		if (item.children) {
			results.push(...flattenBookmarksTree(item.children, folders));
			continue;
		}

		results.push(new Bookmark(item, folders));
	}
	return results;
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

	options(): Result[] {
		return [
			new RemoveBookmark(this.bookmark),
			new EditBookmarkTitle(this.bookmark),
			new EditBookmarkFolder(this.bookmark, this.folders),
		];
	}

	constructor(
		private bookmark: chrome.bookmarks.BookmarkTreeNode,
		private folders: chrome.bookmarks.BookmarkTreeNode[],
	) {
		super();
	}

	public id(): string {
		return this.className() + this.bookmark.id;
	}

	async run(): Promise<void> {
		if (this.bookmark.url) {
			await chrome.tabs.create({ url: this.bookmark.url });
			await focusLastActiveWindow();
		} else {
			console.error("bookmark has no url", this);
		}
	}
}

class RemoveBookmark extends Result {
	title(): string {
		return t("RemoveBookmark.title");
	}
	description(): string {
		return t("RemoveBookmark.description");
	}

	constructor(private bookmark: chrome.bookmarks.BookmarkTreeNode) {
		super();
	}

	public async run(state: BobWindowState): Promise<void> {
		await chrome.bookmarks.remove(this.bookmark.id);
		await state.closeResultOptions();
		await focusLastActiveWindow();
	}
}

function flattenBookmarksTreeFoldersOnly(
	tree: chrome.bookmarks.BookmarkTreeNode[],
) {
	const results: chrome.bookmarks.BookmarkTreeNode[] = [];
	for (const item of tree) {
		if (item.children) {
			results.push(...flattenBookmarksTreeFoldersOnly(item.children));
		}
		if (item.dateGroupModified) {
			results.push(item);
		}
	}
	return results;
}

export class EditBookmarkTitle extends Result {
	constructor(private bookmark: chrome.bookmarks.BookmarkTreeNode) {
		super();
	}
	title() {
		return "Edit Bookmark title";
	}
	onOptionsOpen(state: BobWindowState) {
		state.optionsInput.value = this.bookmark.title;
	}
	options(): Result[] | undefined {
		return [new EditBookmarkTitleSave(this.bookmark)];
	}
	async run(state: BobWindowState) {
		this.emitShowOptionsEvent();
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconFormatTitle);
	}
}

export class EditBookmarkFolder extends Result {
	constructor(
		private bookmark: chrome.bookmarks.BookmarkTreeNode,
		private bookmarkFolders: chrome.bookmarks.BookmarkTreeNode[],
	) {
		super();
	}
	title() {
		return "Edit Bookmark folder";
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconFolder);
	}

	options(): Result[] | undefined {
		return this.bookmarkFolders.map((folder) => {
			const tags: Tag[] = [
				{ text: `${folder.children?.length || 0} children` },
			];
			if (this.bookmark.parentId === folder.id) {
				tags.push({ text: "current", type: "success" });
			}
			return NewResult({
				title: folder.title,
				tags,
				run: async (state) => {
					await chrome.bookmarks.move(this.bookmark.id, {
						parentId: folder.id,
					});
					await state.closeResultOptions();
					await state.loadFreshData();
				},
			});
		});
	}
	async run(state: BobWindowState) {
		this.emitShowOptionsEvent();
	}
}

class EditBookmarkTitleSave extends Result {
	constructor(private bookmark: chrome.bookmarks.BookmarkTreeNode) {
		super();
	}
	title(): string {
		return "Enter name above. Select to save name";
	}

	async run(state: BobWindowState) {
		await chrome.bookmarks.update(this.bookmark.id, {
			title: state.optionsInput.value,
		});
		await state.closeResultOptions();
		await state.loadFreshData();
	}

	public search(search: Search) {
		return this.makeFakeSearch(
			new Search({
				selectionStart: 0,
				text: "",
			}),
			search.text.length > 0 ? search.minMatchScore + 1 : 0,
		);
	}
}
