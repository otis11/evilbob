import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import type { Tag } from "../../core/components/tags/tags";
import { faviconFromUrl, iconBookmark, iconFromString } from "../../core/icons";
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
		return flattenBookmarksTree(tree);
	},
	onLocalChange(state) {
		setLocale(state.locale);
	},
});

function flattenBookmarksTree(tree: chrome.bookmarks.BookmarkTreeNode[]) {
	const results: Result[] = [];
	for (const item of tree) {
		// is item a folder? TODO i dont think folders are relevant, maybe for ui information
		// if(item.dateGroupModified) {
		//     continue
		// }
		if (item.children) {
			results.push(...flattenBookmarksTree(item.children));
			continue;
		}

		results.push(new Bookmark(item));
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
		return [new RemoveBookmark(this.bookmark)];
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

	public async execute(state: BobWindowState): Promise<void> {
		await chrome.bookmarks.remove(this.bookmark.id);
		state.closeResultOptions();
		focusLastActiveWindow();
	}
}
