import { definePlugin } from "../../plugin.ts";

export default definePlugin({
	title: "Website Media Contents",
	description: "Filter media contents from a Website",
	commands: [
		{
			slash: "m",
			title: "Website Media Contents",
			name: "media",
			type: "view",
		},
	],
});
