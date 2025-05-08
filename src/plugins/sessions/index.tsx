import { definePlugin } from "@/plugins";
import { TimerResetIcon } from "lucide-react";

export default definePlugin({
	title: "Sessions",
	description:
		"Interact with your browser sessions and recently closed tabs.",
	icon: <TimerResetIcon></TimerResetIcon>,
	permissions: ["sessions"],
	commands: [
		{
			title: "Sessions",
			type: "view",
			name: "sessions",
		},
	],
});
