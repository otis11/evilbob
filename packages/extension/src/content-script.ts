import { EvilBob } from "./components/EvilBob.tsx";
import { getConfig } from "./config/config.ts";

chrome.runtime.onMessage.addListener(async (message) => {
	const event = message.event;
	const data = message.data;
	if (event === "open") {
		await openEvilBob();
	}
});

if (document.documentURI.endsWith("evil-bob-empty-page.html")) {
	openEvilBob().then();
}

async function openEvilBob() {
	const config = await getConfig();
	EvilBob.instance().openDialog(config);
}
