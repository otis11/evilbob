import { definePlugin } from "@/plugins";
import { PuzzleIcon } from "lucide-react";

export default definePlugin({
	title: "Extensions",
	description: "Interact with your installed extensions",
	icon: <PuzzleIcon></PuzzleIcon>,
	permissions: ["management"],
	commands: [
		{
			title: "Browser Extensions",
			type: "view",
			name: "extensions",
		},
	],
});
