import { GroupHeading } from "../../components/group-heading";
import { ThemeCard } from "../../components/theme-card/theme-card";
import type { BobConfig } from "../../config";
import { iconFromString, iconPencil } from "../../icons";
import { Themes } from "../../theme/themes";

export async function renderThemes(config: BobConfig) {
	const container = document.createElement("div");
	const themesContainer = document.createElement("div");
	themesContainer.classList.add("theme-container");
	container.append(GroupHeading("Themes"), themesContainer);

	for (const theme of Themes) {
		const card = ThemeCard(theme, config.theme === theme);
		if (theme === "custom") {
			const editButton = document.createElement("button");
			editButton.style.display = "flex";
			editButton.style.alignItems = "center";
			editButton.style.margin = "8px auto";
			const icon = iconFromString(iconPencil);
			icon.style.marginRight = "4px";
			const editText = document.createElement("span");
			editText.innerText = "Edit";
			editButton.append(icon, editText);
			editButton.addEventListener("click", () => {
				chrome.tabs.create({
					url: "/src/views/custom-theme/index.html",
				});
			});
			card.append(editButton);
		}
		themesContainer.append(card);
	}
	document.body.append(container);
}
