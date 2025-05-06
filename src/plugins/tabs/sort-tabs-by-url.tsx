import { browserApi } from "@/browser-api";
import { toast } from "@/components/Toast";

export async function Command() {
	const activeWindow = await browserApi.windows.getLastFocused();
	const tabs = await browserApi.tabs.query({
		windowId: activeWindow.id,
	});

	const tabsSortedByUrl = tabs.sort((a, b) => {
		if (!a.url || !b.url) {
			return 0;
		}
		if (a.url > b.url) {
			return 1;
		}
		if (a.url < b.url) {
			return -1;
		}
		return 0;
	});

	let isSortingNeeded = false;
	for (const [index, _] of tabsSortedByUrl.entries()) {
		// t1 t2 t3
		// t3 t2 t1
		// t1 t2 t3
		// is the current tab index the same as the new sorted index
		if (tabsSortedByUrl[index]?.index !== index) {
			isSortingNeeded = true;
			break;
		}
	}

	if (!isSortingNeeded) {
		toast(<span>Already Sorted</span>);
		return;
	}

	const promises = [];
	for (const [index, tab] of tabsSortedByUrl.entries()) {
		if (tab.id) {
			promises.push(browserApi.tabs.move(tab.id, { index }));
		}
	}
	await Promise.all(promises);
}
