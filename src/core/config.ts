import type { BobPluginConfig } from "./BobPlugin";
import type { Locale } from "./locales";
import type { Dimensions } from "./theme";
import { deepMerge } from "./util/deep-merge";

let configCache: BobConfig;

export type ResultUsage = {
	l: number;
	c: number;
};
export type BobConfig = {
	locale: Locale;
	theme: string;
	dimensions: Dimensions;
	pluginsEnabled: Record<string, boolean>;
	pluginsConfig: Record<string, BobPluginConfig | undefined>;
	customTheme: string;
	search?: {
		maxRenderedItems?: number;
	};
};

export const DEFAULT_CONFIG: BobConfig = {
	locale: "en-US",
	search: {
		maxRenderedItems: 40,
	},
	pluginsConfig: {},
	pluginsEnabled: {
		"bob-dark-theme": true,
		"bob-light-theme": true,
		"bob-results": true,
		prefixes: true,
		"focus-active-input": true,
		"clear-search-on-focus": true,
		google: true,
	},
	dimensions: { width: 900, height: 600 },
	theme: "dark",
	customTheme: "",
};

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
