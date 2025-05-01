import { browserApi } from "@evil-bob/extension/src/browser-api.ts";

export default async () => {
	await browserApi.tabs.create({
		url: "https://www.youtube.com/feed/subscriptions",
	});
};
