import { toast } from "@/components/Toast.tsx";
import { browserApi } from "@/lib/browser-api.ts";

export async function Command() {
	const [tabBookmark] = await browserApi.bookmarks.search({
		url: window.location.href,
	});
	if (!tabBookmark) {
		return;
	}
	await browserApi.bookmarks.remove(tabBookmark.id);
	toast("Removed.");
}
