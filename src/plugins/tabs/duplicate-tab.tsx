import { browserApi, getCurrentTab } from "@/lib/browser-api.ts";

export async function Command() {
	const currentTab = await getCurrentTab();
	if (currentTab?.id) {
		await browserApi.tabs.duplicate(currentTab.id);
	}
}
