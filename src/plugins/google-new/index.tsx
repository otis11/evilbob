import { definePlugin } from "@/plugins/index.ts";
import { LoaderCircleIcon } from "lucide-react";

export default definePlugin({
	title: "Google New",
	description: "Google New Shortcuts",
	icon: <LoaderCircleIcon></LoaderCircleIcon>,
	commands: [
		{
			title: "New Google Docs",
			name: "new-google-docs",
			type: "command",
		},
		{
			title: "New Google Sheets",
			name: "new-google-sheets",
			type: "command",
		},
		{
			title: "New Google Slides",
			name: "new-google-slides",
			type: "command",
		},
		{
			title: "New Google Sites",
			name: "new-google-sites",
			type: "command",
		},
		{
			title: "New Google Keep",
			name: "new-google-keep",
			type: "command",
		},
		{
			title: "New Google Calendar",
			name: "new-google-calendar",
			type: "command",
		},
	],
});
