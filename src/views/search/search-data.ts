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
