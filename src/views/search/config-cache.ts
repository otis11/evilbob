import { type BobConfig, getConfig } from "../../config";

let cache: BobConfig;

export async function getConfigCache() {
	if (!cache) {
		cache = await getConfig();
	}
	return cache;
}
