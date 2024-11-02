import { getConfig } from "./config";
import { PLUGINS_LOADED } from "./plugins";
export type Dimensions = { width: number; height: number };

export async function loadCustomTheme() {
	const config = await getConfig();
	const activeStyle = document.getElementById("custom-theme");
	if (activeStyle) {
		activeStyle.textContent = config.customTheme;
		return;
	}
	const style = document.createElement("style");
	style.textContent = config.customTheme;
	style.id = "custom-theme";
	document.head.append(style);
}

export async function loadTheme() {
	const config = await getConfig();

	if (config.theme === "custom") {
		await loadCustomTheme();
		return;
	}

	let noThemeFound = true;
	for (const plugin of PLUGINS_LOADED) {
		if (plugin.id === config.theme) {
			await plugin.provideTheme?.();
			noThemeFound = false;
		}
	}

	if (noThemeFound) {
		(await import("../plugins/bob-dark-theme")).default.provideTheme?.();
	}
}
