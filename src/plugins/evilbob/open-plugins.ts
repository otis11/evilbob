export async function Command() {
	await chrome.runtime.sendMessage({ event: "open-plugins" });
}
