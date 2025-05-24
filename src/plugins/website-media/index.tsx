import { definePlugin } from "@/plugins/index.ts";
import { ImagesIcon } from "lucide-react";

export default definePlugin({
	title: "Website Media Contents",
	description: "Filter media contents from a Website",
	icon: <ImagesIcon></ImagesIcon>,
	commands: [
		{
			title: "Website Media Contents",
			description: "Inspect images, svgs ...",
			name: "media",
			type: "view",
		},
	],
});
