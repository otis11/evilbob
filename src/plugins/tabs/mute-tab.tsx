import { browserApi, getCurrentTab } from "@/browser-api";

export async function Command() {
	const currentTab = await getCurrentTab();
	if (currentTab?.id) {
		await browserApi.tabs.update(currentTab.id, { muted: true });
	}
}
