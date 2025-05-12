import { definePlugin } from "@/plugins/index.ts";
import { BookmarkIcon } from "lucide-react";

export default definePlugin({
	title: "Bookmarks",
	description: "Interact with bookmarks",
	permissions: ["bookmarks"],
	icon: <BookmarkIcon></BookmarkIcon>,
	commands: [
		{
			title: "Bookmarks",
			name: "bookmarks",
			type: "view",
		},
		{
			title: "Bookmark current tab",
			name: "bookmark-current-tab",
			type: "command",
		},
		{
			title: "Remove bookmark current tab",
			name: "remove-bookmark-current-tab",
			type: "command",
		},
	],
});
