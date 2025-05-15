import { definePlugin } from "@/plugins/index.ts";
import { ImagesIcon } from "lucide-react";

export default definePlugin({
	title: "Image",
	description: "Image",
	icon: <ImagesIcon></ImagesIcon>,
	commands: [
		{
			title: "Image",
			name: "image",
			type: "view",
		},
	],
});
