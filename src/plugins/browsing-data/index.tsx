import { definePlugin } from "@/plugins/index.ts";
import { CircleXIcon } from "lucide-react";

export default definePlugin({
	title: "Browsing Data",
	description: "Interact with your Browsing data",
	icon: <CircleXIcon></CircleXIcon>,
	permissions: ["browsingData"],
	commands: [
		{
			title: "Delete browsing data",
			name: "delete-browsing-data",
			type: "view",
		},
	],
});
