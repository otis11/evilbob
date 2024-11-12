import { defineBobPlugin } from "../../core/BobPlugin";
import type { Result } from "../../core/components/result/result";
import { NewResult } from "../../core/components/result/simpe-result.ts";
import { iconBookmark } from "../../core/icons";
import { getLastActiveTab } from "../../core/util/last-active-tab.ts";
import { focusLastActiveWindow } from "../../core/util/last-active-window.ts";

export default defineBobPlugin({
	permissions: ["bookmarks", "tabs"],
	prefix: "ba",
	description() {
		return "For instance create a bookmark for the current tab.";
	},
	name(): string {
		return "Bookmark actions";
	},

	async provideResults(): Promise<Result[]> {
		const tab = await getLastActiveTab();
		if (!tab?.url) {
			return [];
		}

		// firefox will throw an error
		if (tab.url.startsWith("about:")) {
			return [];
		}
		const bookmarks = await chrome.bookmarks.search({ url: tab.url });
		const tabBookmark = bookmarks[0];
		const results: Result[] = [
			NewResult({
				title: tabBookmark
					? "Remove tab from bookmarks"
					: "Add tab to bookmarks",
				description: "Remove/Add tab bookmarks",
				run: async () => {
					if (tab?.url) {
						if (!tabBookmark) {
							await chrome.bookmarks.create({
								url: tab.url,
								title: tab.title,
							});
						} else {
							await chrome.bookmarks.remove(tabBookmark.id);
						}
						await focusLastActiveWindow();
					}
				},
			}),
		];
		return results;
	},
	icon: iconBookmark,
});
