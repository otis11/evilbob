import { definePlugin } from "@/plugins/index.ts";
import { PaletteIcon } from "lucide-react";

export default definePlugin({
	title: "Colors",
	description: "Manage your colors",
	icon: <PaletteIcon></PaletteIcon>,
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
