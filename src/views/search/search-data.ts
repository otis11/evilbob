import type { Result } from "../../components/result/result";
import { getEnabledPlugins } from "../../plugins";
import type { Plugin } from "../../plugins/Plugin";

let results: Result[] = [];
let plugins: Plugin[] = [];
export function getResults() {
	return results;
}

export function getPlugins() {
	return plugins;
}

export async function loadFreshData() {
	plugins = await getEnabledPlugins();
	const promises = plugins.map((plugin) => plugin.loadResults());
	await Promise.all(promises);
	results = [];
	for (const plugin of plugins) {
		results.push(...plugin.results);
	}
	console.log(plugins);
}
