import { toast } from "@/components/Toast.tsx";
import { browserApi, getCurrentTab } from "@/lib/browser-api.ts";

export async function Command() {
	const currentTab = await getCurrentTab();
	if (!currentTab) {
		return;
	}
	const [tabBookmark] = await browserApi.bookmarks.search({
		url: currentTab.url,
	});
	if (!tabBookmark) {
		return;
	}
	await browserApi.bookmarks.remove(tabBookmark.id);
	toast("Removed.");
}
