import { definePlugin } from "@/plugins/index.ts";
import { SmileIcon } from "lucide-react";

export default definePlugin({
	title: "Emoji & Kaomoji",
	description: "Use emoji & kaomoji",
	icon: <SmileIcon></SmileIcon>,
	commands: [
		{
			title: "Emoji",
			name: "emoji",
			type: "view",
		},
		{
			title: "Kaomoji",
			name: "kaomoji",
			type: "view",
		},
	],
});
