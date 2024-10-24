import { deepMerge } from "./util/deep-merge";

export type ResultGroupConfig = {
	enabled: boolean;
};

export type ResultUsage = {
	l: number;
	c: number;
};
export type BobUsage = {
	results: Record<string, ResultUsage | undefined>;
};

export const DEFAULT_USAGE: BobUsage = {
	results: {},
} as const;

export async function updateUsage(newUsage: Partial<BobUsage>) {
	const currentUsage = await getUsage();

	await chrome.storage.sync.set({
		usage: deepMerge(currentUsage, newUsage),
	});
}

export async function setUsage(newUsage: Partial<BobUsage>) {
	await chrome.storage.sync.set({
		usage: newUsage,
	});
}

export async function getUsage(): Promise<BobUsage> {
	return (await chrome.storage.sync.get(["usage"])).usage || DEFAULT_USAGE;
}
