import { updateConfig } from "../../config";
import type { BobPluginMeta } from "../../plugin-list";
import { loadTheme } from "../../theme";
import "./theme-card.css";

export function ThemeCard(plugin: BobPluginMeta, isActiveTheme = false) {
	const cardContainer = document.createElement("div");
	cardContainer.classList.add("theme-card");
	if (isActiveTheme) {
		cardContainer.classList.add("theme-card-active");
	}

	cardContainer.addEventListener("click", async () => {
		await updateConfig({ theme: plugin.id });
		await loadTheme();
		const active = document.querySelector(".theme-card-active");
		active?.classList.remove("theme-card-active");

		const newActive = document.querySelector(
			`.theme-card[data-theme="${plugin}"]`,
		);
		newActive?.classList.add("theme-card-active");
	});

	const base = document.createElement("div");
	base.classList.add("theme-card-base");
	base.innerText = plugin.name;

	cardContainer.append(base);
	return cardContainer;
}
