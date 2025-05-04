import { definePlugin } from "@/plugins";

export default definePlugin({
	title: "Window",
	description: "Interact with browser windows",
	commands: [
		{
			title: "Close other windows",
			type: "command",
			name: "close-other-windows",
		},
	],
});
