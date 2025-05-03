import { browserApi } from "@/browser-api.ts";

export async function Command() {
	await browserApi.tabs.create({
		url: "https://www.youtube.com/feed/history",
	});
}
