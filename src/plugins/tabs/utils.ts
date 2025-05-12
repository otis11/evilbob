import { browserApi } from "@/lib/browser-api.ts";

export async function closeOtherTabs(tab: chrome.tabs.Tab) {
	const activeWindow = await browserApi.windows.getLastFocused();
	const tabs = await browserApi.tabs.query({
		windowId: activeWindow.id,
	});
	const promises = [];
	for (const otherTab of tabs) {
		if (otherTab.id && otherTab.id !== tab?.id) {
			promises.push(browserApi.tabs.remove(otherTab.id));
		}
	}
	await Promise.all(promises);
}
