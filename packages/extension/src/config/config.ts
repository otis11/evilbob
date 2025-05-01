import { deepMerge } from "../../../utils/src/deep-merge.ts";
import { type KeybindingKey, defaultKeybindings } from "./keybindings.ts";

let configCache: EvilBobConfig | undefined;

export interface Dimensions {
	width: number;
	height: number;
}

export interface EvilBobConfig {
	dimensions: Dimensions;
	plugins: {
		enabled: Record<string, boolean>;
	};
	keybindings: Record<
		KeybindingKey,
		{ keys: string[]; description?: string; title?: string }
	>;
}

export const DEFAULT_CONFIG: EvilBobConfig = {
	dimensions: { width: 900, height: 600 },
	plugins: {
		// TODO determine default enabled plugins
		// Should be only without permissions needed
		enabled: {
			colors: true,
			"website-media": true,
		},
	},
	keybindings: defaultKeybindings,
};

export async function updateConfig(newConfig: Partial<EvilBobConfig>) {
	const currentConfig = await getConfig();
	configCache = undefined;

	const newMergedConfig = deepMerge(currentConfig, newConfig);
	await chrome.storage.sync.set({
		config: newMergedConfig,
	});
}

export async function setConfig(newConfig: Partial<EvilBobConfig>) {
	configCache = undefined;
	await chrome.storage.sync.set({
		config: newConfig,
	});
}

export async function getConfig(forceRefresh = false): Promise<EvilBobConfig> {
	if (forceRefresh) {
		configCache = undefined;
	}
	if (!configCache) {
		configCache =
			(await chrome.storage.sync.get(["config"])).config ||
			DEFAULT_CONFIG;
	}
	return configCache || DEFAULT_CONFIG;
}
