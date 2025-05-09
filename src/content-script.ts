import { getConfig } from "./lib/config.ts";
import { EvilbobRoot } from "./lib/evilbob-root.tsx";

chrome.runtime.onMessage.addListener(async (message) => {
	const event = message.event;
	const data = message.data;
	if (event === "open") {
		await openEvilbob();
	}
});

if (document.documentURI.endsWith("evilbob-empty-page.html")) {
	openEvilbob().then();
}

async function openEvilbob() {
	const config = await getConfig();
	EvilbobRoot.instance().openDialog(config);
}
