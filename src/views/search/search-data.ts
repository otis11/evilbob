import type { ResultGroup } from "../../components/result-group";
import { getEnabledResultGroups } from "../../components/result-groups";
import type { Result } from "../../components/result/result";

let results: Result[] = [];
let resultGroups: ResultGroup[] = [];
export function getResults() {
	return results;
}

export function getResultGroups() {
	return resultGroups;
}

export async function loadFreshData() {
	resultGroups = await getEnabledResultGroups();
	const promises = resultGroups.map((group) => group.loadResults());
	await Promise.all(promises);
	results = [];
	for (const group of resultGroups) {
		results.push(...group.results);
	}
}

import { type BobConfig, getConfig } from "../../config";
import { type BobUsage, getUsage } from "../../usage";

let configCache: BobConfig;

export async function getConfigCache() {
	if (!configCache) {
		configCache = await getConfig();
	}
	return configCache;
}

let usageCache: BobUsage;

export async function getUsageCache() {
	if (!usageCache) {
		usageCache = await getUsage();
	}
	return usageCache;
}
