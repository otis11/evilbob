import { definePlugin } from "@/plugins/index.ts";

export default definePlugin({
	title: "Colors",
	description: "Manage your colors",
	commands: [
		{
			title: "Colors",
			name: "colors",
			type: "view",
		},
		{
			title: "Add color",
			name: "add-color",
			type: "view",
		},
	],
});
