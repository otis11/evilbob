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
	const button = document.createElement("button");
	button.setAttribute("data-testid", "open-evilbob-button");
	button.addEventListener("click", () => {
		openEvilbob().then();
	});
	button.innerText = "Open Evilbob";
	button.style.position = "absolute";
	button.style.top = "0";
	button.style.left = "0";
	button.style.zIndex = "99999999";
	document.body.appendChild(button);
}

if (document.documentURI.endsWith("evilbob-empty-page.html")) {
	openEvilbob().then();
}

async function openEvilbob() {
	const config = await getConfig();
	EvilbobRoot.instance().openDialog(config);
}
