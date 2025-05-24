import { definePlugin } from "@/plugins/index.ts";
import { CookieIcon } from "lucide-react";

export default definePlugin({
	title: "Cookies",
	description: "Cookies of website",
	permissions: ["cookies", "tabs"],
	hostPermissions: ["https://*/*", "http://*/*"],
	icon: <CookieIcon></CookieIcon>,
	commands: [
		{
			title: "Cookies current tab",
			name: "cookies",
			type: "view",
		},
		{
			title: "Clear cookies current tab",
			name: "clear-second-level-domain-cookies",
			type: "command",
		},
	],
});
