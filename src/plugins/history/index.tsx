import { definePlugin } from "@/plugins";
import { HistoryIcon } from "lucide-react";

export default definePlugin({
	title: "History",
	description: "Interact with your history",
	icon: <HistoryIcon></HistoryIcon>,
	permissions: ["history"],
	commands: [
		{
			title: "Browser history",
			type: "view",
			name: "history",
		},
		{
			title: "Url history",
			description: "inspect all visits to a url",
			type: "view",
			name: "visits",
		},
	],
});
