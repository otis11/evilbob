import { RESULT_GROUPS_BROWSER_FILTERED } from "../../components/result-groups";
import { iconCog, iconFromString, iconReload } from "../../icons";
import { browserName, browserVersion } from "../../platform";
import { resultsCounter } from "./dom";
import { getResultGroups, loadFreshData } from "./search-data";

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

	const total = RESULT_GROUPS_BROWSER_FILTERED.length;
	const enabled = getResultGroups().length;
	const enabledGroups = document.createElement("span");
	enabledGroups.innerText = `${enabled}/${total} result groups enabled`;

	footer?.append(
		resultsCounter,
		enabledGroups,
		spacer,
		browser,
		bobVersion,
		reload,
		settings,
	);
}
