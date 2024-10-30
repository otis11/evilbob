import { getConfig } from "./config";
import { PLUGINS_LOADED } from "./plugins";
export type Dimensions = { width: number; height: number };

export async function loadTheme() {
	const config = await getConfig();
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
