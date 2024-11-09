import { deepMerge } from "./util/deep-merge";

let usageCache: BobUsage;

export type ResultUsage = {
	l: number;
	c: number;
	t: string;
};
export type BobUsage = {
	results: Record<string, ResultUsage | undefined>;
};

export const DEFAULT_USAGE: BobUsage = {
	results: {},
} as const;

export async function updateUsage(newUsage: Partial<BobUsage>) {
	const currentUsage = await getUsage();

	await chrome.storage.local.set({
		usage: deepMerge(currentUsage, newUsage),
	});
}

export async function setUsage(newUsage: Partial<BobUsage>) {
	await chrome.storage.local.set({
		usage: newUsage,
	});
}

export async function getUsage(): Promise<BobUsage> {
	if (!usageCache) {
		usageCache =
			(await chrome.storage.local.get(["usage"])).usage || DEFAULT_USAGE;
	}

	return usageCache;
}
