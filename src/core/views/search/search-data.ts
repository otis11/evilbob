import type { Result } from "../../components/result/result";
import { PLUGINS_LOADED_PROVIDE_RESULTS } from "../../plugins";

let pluginResults: Result[][] = [];

export function getPluginResults() {
	return pluginResults;
}

export async function loadFreshData() {
	const promises = PLUGINS_LOADED_PROVIDE_RESULTS.map((plugin) =>
		plugin.provideResults?.(),
	).filter((r) => r !== undefined);
	pluginResults = [...(await Promise.all(promises))];
}
