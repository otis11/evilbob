import { browserApi } from "@/browser-api.ts";
import { toast } from "@/components/Toast.tsx";

export async function Command() {
	await browserApi.bookmarks.create({
		url: window.location.href,
		title: document.title,
	});
	toast(<span>Bookmarked.</span>);
}
