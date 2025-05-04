import { browserApi } from "@/browser-api";

export async function Command() {
	const [activeTab] = await browserApi.tabs.query({
		active: true,
		currentWindow: true,
	});
	const windows = await browserApi.windows.getAll();
	for (const w of windows) {
		if (w.id && w.id !== activeTab?.windowId) {
			await browserApi.windows.remove(w.id);
		}
	}
}
