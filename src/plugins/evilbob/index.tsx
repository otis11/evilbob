import { definePlugin } from "@/plugins/index.ts";
import { CircleDotIcon } from "lucide-react";

export default definePlugin({
	title: "Evilbob",
	description: "Evilbob",
	icon: <CircleDotIcon></CircleDotIcon>,
	commands: [
		{
			title: "Bobify Page",
			name: "bobify-page",
			type: "command",
		},
	],
});
