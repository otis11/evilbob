import { definePlugin } from "@/plugins/index.ts";
import { DownloadIcon } from "lucide-react";

export default definePlugin({
	title: "Downloads",
	description: "Manage your downloads",
	icon: <DownloadIcon></DownloadIcon>,
	permissions: ["downloads"],
	commands: [
		{
			title: "Downloads",
			name: "downloads",
			type: "view",
		},
		{
			title: "Show Downloads Default Folder",
			name: "show-downloads-default-folder",
			type: "command",
		},
	],
});
