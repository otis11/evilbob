import { definePlugin } from "../../plugin.ts";

export default definePlugin({
	title: "Bookmarks",
	description: "Interact with bookmarks",
	permissions: ["bookmarks"],
	commands: [
		{
			title: "Bookmark current tab",
			name: "bookmark-current-tab",
			type: "command",
		},
		{
			title: "Bookmarks",
			name: "bookmarks",
			type: "view",
		},
	],
});
