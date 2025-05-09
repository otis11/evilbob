import { browserApi } from "@/lib/browser-api.ts";

export async function Command() {
	const activeWindow = await browserApi.windows.getLastFocused();
	const tabs = await browserApi.tabs.query({
		windowId: activeWindow.id,
	});
	const promises = [];
	for (const tab of tabs) {
		promises.push(browserApi.windows.create({ tabId: tab.id }));
	}
	await Promise.all(promises);
}
