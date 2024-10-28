import { iconCog, iconFromString, iconReload } from "../../icons";
import { browserName, browserVersion } from "../../platform";
import { resultsCounter } from "./dom";
import { loadFreshData } from "./search-data";

export async function renderFooter() {
	const footer = document.getElementById("footer");

	const browser = document.createElement("span");
	browser.innerText = `${browserName} ${browserVersion}`;

	const bobVersion = document.createElement("span");
	bobVersion.innerText = `Bob ${chrome.runtime.getManifest().version}`;

	const reload = iconFromString(iconReload, "16px");
	reload.addEventListener("click", async () => {
		await loadFreshData();
	});

	const settings = iconFromString(iconCog, "16px");
	settings.addEventListener("click", () => {
		chrome.runtime.openOptionsPage();
	});

	const spacer = document.createElement("span");
	spacer.classList.add("spacer");

	footer?.append(
		resultsCounter,
		spacer,
		browser,
		bobVersion,
		reload,
		settings,
	);
}
