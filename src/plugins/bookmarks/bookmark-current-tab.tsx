import { toast } from "@/components/Toast.tsx";
import { browserApi } from "@/lib/browser-api.ts";

export async function Command() {
	const [tabBookmark] = await browserApi.bookmarks.search({
		url: window.location.href,
	});
	if (tabBookmark) {
		toast("Tab already bookmarked.");
		return;
	}
	await browserApi.bookmarks.create({
		url: window.location.href,
		title: document.title,
	});
	toast(<span>Bookmarked.</span>);
}
