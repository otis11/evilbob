import { definePlugin } from "@/plugins";
import { CircleFadingArrowUpIcon } from "lucide-react";

export default definePlugin({
	title: "Top Sites",
	description: "Interact with your top sites",
	icon: <CircleFadingArrowUpIcon></CircleFadingArrowUpIcon>,
	permissions: ["topSites"],
	commands: [
		{
			title: "Top Sites",
			type: "view",
			name: "top-sites",
		},
	],
});
