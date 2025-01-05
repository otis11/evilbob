export async function getLastActiveTab() {
	const storage = await chrome.storage.local.get(["lastFocusedWindowId"]);
	const tabs = await chrome.tabs.query({
		windowId: storage.lastFocusedWindowId,
		active: true,
	});
	return tabs[0] as chrome.tabs.Tab | undefined;
}
