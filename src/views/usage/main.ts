import "../../theme";
import { getUsage } from "../../usage";
import { unixTimeToHumanReadable } from "../../util/time";
import "../global.css";
import "./main.css";

async function renderUsage() {
	const usage = await getUsage();

	const resultKeys = Object.keys(usage.results).sort((keyA, keyB) => {
		const lA = usage.results[keyA]?.l || 0;
		const lB = usage.results[keyB]?.l || 0;
		if (lA > lB) {
			return -1;
		}
		if (lA < lB) {
			return 1;
		}
		return 0;
	});
	for (const key of resultKeys) {
		const container = document.createElement("div");
		container.classList.add("result-usage");

		const lastUsed = document.createElement("div");
		lastUsed.classList.add("result-usage-last");
		lastUsed.innerText = usage.results[key]?.l
			? unixTimeToHumanReadable(usage.results[key]?.l)
			: "";

		const id = document.createElement("div");
		id.classList.add("result-usage-id");
		id.innerText = key;

		const count = document.createElement("div");
		count.classList.add("result-usage-count");
		count.innerText = (usage.results[key]?.c || 0).toString();

		container.append(id, count, lastUsed);
		document.body.append(container);
	}
}

renderUsage();
