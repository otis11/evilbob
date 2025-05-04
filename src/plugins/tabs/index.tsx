import { definePlugin } from "@/plugins";
import { BetweenVerticalEndIcon } from "lucide-react";

export default definePlugin({
	title: "Tabs",
	description: "Interact with your tabs",
	icon: <BetweenVerticalEndIcon></BetweenVerticalEndIcon>,
	permissions: ["tabs"],
	commands: [
		{
			title: "Tabs",
			type: "view",
			name: "tabs",
		},
	],
});
