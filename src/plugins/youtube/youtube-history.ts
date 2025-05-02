import { browserApi } from "@/browser-api.ts";

export default async () => {
	await browserApi.tabs.create({
		url: "https://www.youtube.com/feed/history",
	});
};
