import { browserApi } from "@/browser-api.ts";

export async function Command() {
	await browserApi.bookmarks.create({
		url: window.location.href,
		title: document.title,
	});
}
