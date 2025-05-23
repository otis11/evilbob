import { definePlugin } from "@/plugins/index.ts";
import { CircleDotIcon } from "lucide-react";

export default definePlugin({
	title: "Evilbob",
	description: "Evilbob",
	icon: <CircleDotIcon></CircleDotIcon>,
	commands: [
		{
			title: "Bobify Page",
			name: "bobify-page",
			type: "command",
		},
		{
			title: "Open Plugins",
			name: "open-plugins",
			type: "command",
		},
		{
			title: "Open Settings",
			name: "open-settings",
			type: "command",
		},
	],
});
