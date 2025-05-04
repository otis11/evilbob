import { definePlugin } from "@/plugins/index.ts";
import { SquarePlayIcon } from "lucide-react";

export default definePlugin({
	title: "Youtube",
	description: "Youtube Shortcuts",
	icon: <SquarePlayIcon></SquarePlayIcon>,
	commands: [
		{
			title: "Open Youtube History",
			name: "youtube-history",
			type: "command",
		},
		{
			title: "Open Youtube Subscriptions",
			name: "youtube-subscriptions",
			type: "command",
		},
		{
			title: "Open Youtube Watch Later",
			name: "youtube-watch-later",
			type: "command",
		},
		{
			title: "Open Youtube Playlists",
			name: "youtube-playlists",
			type: "command",
		},
	],
});
