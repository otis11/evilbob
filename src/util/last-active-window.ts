export async function getLastActiveWindow() {
	const storage = await chrome.storage.sync.get(["lastFocusedWindowId"]);
	return (
		((await chrome.windows.get(
			storage.lastFocusedWindowId,
		)) as chrome.windows.Window) || undefined
	);
}
export async function getLastActiveWindowTabs() {
	const storage = await chrome.storage.sync.get(["lastFocusedWindowId"]);
	return await chrome.tabs.query({
		windowId: storage.lastFocusedWindowId,
	});
}

export async function refocusLastActiveWindow() {
	const storage = await chrome.storage.sync.get(["lastFocusedWindowId"]);
	await chrome.windows.update(storage.lastFocusedWindowId, {
		focused: true,
	});
}
