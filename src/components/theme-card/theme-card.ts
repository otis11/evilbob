import { updateConfig } from "../../config";
import { iconBob, iconFromString } from "../../icons";
import { loadTheme } from "../../theme";
import type { Theme } from "../../theme/themes";
import { Result } from "../result/result";
import type { Search } from "../search";
import "./theme-card.css";

export function ThemeCard(theme: Theme, isActiveTheme = false) {
	const cardContainer = document.createElement("div");
	cardContainer.setAttribute("data-theme", theme);
	cardContainer.classList.add("theme-card");
	if (isActiveTheme) {
		cardContainer.classList.add("theme-card-active");
	}
	cardContainer.addEventListener("click", async () => {
		await updateConfig({ theme });
		await loadTheme();
		const active = document.querySelector(".theme-card-active");
		active?.classList.remove("theme-card-active");

		const newActive = document.querySelector(
			`.theme-card[data-theme="${theme}"]`,
		);
		newActive?.classList.add("theme-card-active");
	});

	const base = document.createElement("div");
	base.classList.add("theme-card-base");
	base.innerText = theme;

	const cardColors = document.createElement("div");
	cardColors.classList.add("theme-card-colors");
	for (const color of ["primary", "accent", "success", "error"]) {
		const colorDiv = document.createElement("div");
		colorDiv.style.backgroundColor = `var(--bob-color-${color})`;
		cardColors.append(colorDiv);
	}

	const li = new ResultTheme().asHtmlElement();
	li.style.width = "100%";
	cardContainer.append(base, cardColors, li);
	return cardContainer;
}

class ResultTheme extends Result {
	constructor() {
		super({
			title: "title",
			description: "description",
			tags: [
				{ text: "tag 1", type: "default" },
				{ text: "tag error", type: "error" },
			],
			prepend: iconFromString(iconBob),
		});
	}
	async execute(search: Search): Promise<void> {}
}
