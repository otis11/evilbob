import { getConfig } from "../config";
import "./themes";
export type Dimensions = { width: number; height: number };

export async function loadCustomTheme() {
	const config = await getConfig();
	const style = document.getElementById("custom-theme-style");
	if (style) {
		style.textContent = config.customTheme;
	} else {
		const style = document.createElement("style");
		style.textContent = config.customTheme;
		globalThis.document.head.append(style);
	}
}

export async function loadTheme() {
	if (globalThis.document?.documentElement) {
		const config = await getConfig();
		if (config.theme === "custom") {
			await loadCustomTheme();
		}
		globalThis.document.documentElement.setAttribute(
			"data-theme",
			config.theme,
		);
	}
}

loadTheme();
