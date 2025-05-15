import { definePlugin } from "@/plugins/index.ts";
import { ImagesIcon } from "lucide-react";

export default definePlugin({
	title: "Image Conversion",
	description: "Image Conversion",
	icon: <ImagesIcon></ImagesIcon>,
	commands: [
		{
			title: "Image Conversion",
			name: "image-conversion",
			type: "view",
		},
	],
});
