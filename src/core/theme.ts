import { getConfig } from "./config";
import { PLUGINS_LOADED } from "./plugins";
export type Dimensions = { width: number; height: number };

export async function loadTheme() {
	const config = await getConfig();
	for (const plugin of PLUGINS_LOADED) {
		if (plugin.id === config.theme) {
			plugin.provideTheme?.();
		}
	}
}
