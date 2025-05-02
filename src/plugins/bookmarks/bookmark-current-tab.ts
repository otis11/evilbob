import { browserApi } from "@/browser-api.ts";

export default async () => {
	await browserApi.bookmarks.create({
		url: window.location.href,
		title: document.title,
	});
};
