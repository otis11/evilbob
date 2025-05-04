import { definePlugin } from "@/plugins";
import { HistoryIcon } from "lucide-react";

export default definePlugin({
	title: "History",
	description: "Interact with your history",
	icon: <HistoryIcon></HistoryIcon>,
	permissions: ["history"],
	commands: [
		{
			title: "History",
			type: "view",
			name: "history",
		},
	],
});
