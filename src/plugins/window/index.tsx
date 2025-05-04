import { definePlugin } from "@/plugins";
import { AppWindowMacIcon } from "lucide-react";

export default definePlugin({
	title: "Window",
	description: "Interact with browser windows",
	icon: <AppWindowMacIcon></AppWindowMacIcon>,
	commands: [
		{
			title: "Close other windows",
			type: "command",
			name: "close-other-windows",
		},
	],
});
