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
		{
			title: "Close other tabs",
			type: "command",
			name: "close-other-tabs",
		},
		{
			title: "Duplicate tab",
			type: "command",
			name: "duplicate-tab",
		},
		{
			title: "Mute tab",
			type: "command",
			name: "mute-tab",
		},
		{
			title: "Unmute tab",
			type: "command",
			name: "unmute-tab",
		},
		{
			title: "Pin tab",
			type: "command",
			name: "pin-tab",
		},
		{
			title: "Unpin tab",
			type: "command",
			name: "unpin-tab",
		},
		{
			title: "Merge windows",
			type: "command",
			name: "merge-windows",
		},
		{
			title: "Split tabs into windows",
			type: "command",
			name: "split-into-windows",
		},
		{
			title: "Sort tabs by url",
			type: "command",
			name: "sort-tabs-by-url",
		},
	],
});
