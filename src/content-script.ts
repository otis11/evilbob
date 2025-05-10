import { getConfig } from "./lib/config.ts";
import { EvilbobRoot } from "./lib/evilbob-root.tsx";

// !! do not add async. Breaks in firefox sendResponse, will always be undefined
chrome.runtime.onMessage.addListener((message) => {
	const event = message.event;
	const data = message.data;
	if (event === "open") {
		openEvilbob().then();
	}
});

if (__IS_DEV_BUILD__) {
	window.addEventListener("evilbob-open", (event) => {
		openEvilbob().then();
	});
}

if (document.documentURI.endsWith("evilbob-empty-page.html")) {
	openEvilbob().then();
}

async function openEvilbob() {
	const config = await getConfig();
	EvilbobRoot.instance().openDialog(config);
}
