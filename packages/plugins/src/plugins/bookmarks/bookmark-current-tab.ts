import { browserApi } from "@evil-bob/extension/src/browser-api.ts";

export default async () => {
	await browserApi.bookmarks.create({
		url: window.location.href,
		title: document.title,
	});
};
