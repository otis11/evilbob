export async function getLastActiveWindow() {
	const storage = await chrome.storage.local.get(["lastFocusedWindowId"]);
	return (
		((await chrome.windows.get(
			storage.lastFocusedWindowId,
		)) as chrome.windows.Window) || undefined
	);
}
export async function getLastActiveWindowTabs() {
	const storage = await chrome.storage.local.get(["lastFocusedWindowId"]);
	return await chrome.tabs.query({
		windowId: storage.lastFocusedWindowId,
	});
}

export async function focusLastActiveWindow() {
	const storage = await chrome.storage.local.get(["lastFocusedWindowId"]);
	try {
		await chrome.windows.update(storage.lastFocusedWindowId, {
			focused: true,
		});
		if (chrome.runtime.lastError) {
			console.error(
				"Cannot focus last focused window",
				chrome.runtime.lastError,
			);
		}
	} catch (error) {}
	parent.postMessage(
		{ type: "bob.focus-last-active-window", data: {} },
		{ targetOrigin: "*" },
	);
}
