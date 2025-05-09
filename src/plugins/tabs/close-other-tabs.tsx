import { browserApi, getCurrentTab } from "@/lib/browser-api.ts";

export async function Command() {
	const activeWindow = await browserApi.windows.getLastFocused();
	const tabs = await browserApi.tabs.query({
		windowId: activeWindow.id,
	});
	const lastActiveTab = await getCurrentTab();
	const promises = [];
	for (const tab of tabs) {
		if (tab.id && tab.id !== lastActiveTab?.id) {
			promises.push(browserApi.tabs.remove(tab.id));
		}
	}
	await Promise.all(promises);
}
