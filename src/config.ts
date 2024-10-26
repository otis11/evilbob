// @ts-expect-error typescript doesnt know dark.css?raw as a file
import darkTheme from "./themes/dark.css?raw";

import type { Dimensions } from "./theme";
import type { Theme } from "./theme/themes";
import { deepMerge } from "./util/deep-merge";

export type ResultGroupConfig = {
	enabled: boolean;
};

export type ResultUsage = {
	l: number;
	c: number;
};
export type BobConfig = {
	groups: Record<string, ResultGroupConfig | undefined>;
	dimensions: Dimensions;
	theme: Theme;
	customTheme: string;
	preserveInput: {
		onWindowChange: boolean;
	};
};

export const DEFAULT_CONFIG: BobConfig = {
	preserveInput: {
		onWindowChange: false,
	},
	groups: {
		ResultGroupBob: {
			enabled: true,
		},
		ResultGroupPrefixes: {
			enabled: true,
		},
		ResultGroupWindow: {
			enabled: true,
		},
	},
	dimensions: { width: 900, height: 600 },
	theme: "dark",
	customTheme: darkTheme.replace(
		'[data-theme="dark"]',
		'[data-theme="custom"]',
	),
} as const;

export async function updateConfig(newConfig: Partial<BobConfig>) {
	const currentConfig = await getConfig();

	await chrome.storage.sync.set({
		config: deepMerge(currentConfig, newConfig),
	});
}

export async function setConfig(newConfig: Partial<BobConfig>) {
	await chrome.storage.sync.set({
		config: newConfig,
	});
}

export async function getConfig(): Promise<BobConfig> {
	return (await chrome.storage.sync.get(["config"])).config || DEFAULT_CONFIG;
}
