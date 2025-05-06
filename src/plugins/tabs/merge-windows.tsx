import { browserApi } from "@/browser-api";

export async function Command() {
	const lastWindow = await browserApi.windows.getLastFocused();
	const tabs = await browserApi.tabs.query({});
	const tabsNotInLastWindow = tabs
		.filter((tab) => tab.windowId !== lastWindow.id)
		.map((w) => w.id || -1);
	await browserApi.tabs.move(tabsNotInLastWindow, {
		windowId: lastWindow.id,
		index: 999,
	});
}
