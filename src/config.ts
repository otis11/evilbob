// @ts-expect-error typescript doesnt know dark.css?raw as a file
import darkTheme from "./themes/dark.css?raw";

import type { Locale } from "./locale";
import type { Dimensions } from "./theme";
import type { Theme } from "./theme/themes";
import { deepMerge } from "./util/deep-merge";

let configCache: BobConfig;

export type ResultGroupConfig = {
	enabled: boolean;
};

export type ResultUsage = {
	l: number;
	c: number;
};
export type BobConfig = {
	locale: Locale;
	groups: Record<string, ResultGroupConfig | undefined>;
	dimensions: Dimensions;
	theme: Theme;
	customTheme: string;
	onBobWindowLeave?: {
		closeWindow?: boolean;
		clearSearch?: boolean;
	};
	onBobWindowFocus?: {
		refreshResults?: boolean;
	};
};

export const DEFAULT_CONFIG: BobConfig = {
	locale: "en-US",
	onBobWindowLeave: {
		closeWindow: false,
		clearSearch: true,
	},
	onBobWindowFocus: {
		refreshResults: true,
	},
	groups: {
		Bob: {
			enabled: true,
		},
		Prefixes: {
			enabled: true,
		},
		Window: {
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

	const newMergedConfig = deepMerge(currentConfig, newConfig);
	await chrome.storage.sync.set({
		config: newMergedConfig,
	});

	chrome.runtime.sendMessage(chrome.runtime.id, {
		type: "bob.config.change",
		data: newMergedConfig,
	});
}

export function onConfigUpdate(callback: (config: BobConfig) => void) {
	chrome.runtime.onMessage.addListener((msg) => {
		if (msg.type === "bob.config.change") {
			callback(msg.data);
		}
	});
}

export async function setConfig(newConfig: Partial<BobConfig>) {
	await chrome.storage.sync.set({
		config: newConfig,
	});
}

export async function getConfig(): Promise<BobConfig> {
	if (!configCache) {
		configCache =
			(await chrome.storage.sync.get(["config"])).config ||
			DEFAULT_CONFIG;
	}
	return configCache;
}
