import { iconBob, iconFromString } from "../../icons";
import { setCurrentTheme } from "../../themes";
import type { Theme } from "../../themes/config";
import type { Search } from "../search";
import { SearchResult } from "../search-result/search-result";
import "./theme-card.css";

export function ThemeCard(theme: Theme) {
	const cardContainer = document.createElement("div");
	cardContainer.setAttribute("data-theme", theme);
	cardContainer.classList.add("theme-card");
	cardContainer.addEventListener("click", () => {
		setCurrentTheme(theme);
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

	const li = new SearchResultTheme().asHtmlElement();
	li.style.width = "100%";
	cardContainer.append(base, cardColors, li);
	return cardContainer;
}

class SearchResultTheme extends SearchResult {
	constructor() {
		super({
			title: "title",
			description: "description",
			tags: [
				{ text: "tag 1", type: "default" },
				{ text: "tag error", type: "error" },
			],
			searchText: "",
			prepend: iconFromString(iconBob),
		});
	}
	onSelect(search: Search): void {}
}
