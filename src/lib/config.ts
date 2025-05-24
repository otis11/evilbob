import { deepMerge } from "@/lib/utils.ts";
import {
	type Keybinding,
	type KeybindingKey,
	defaultKeybindings,
} from "./keybindings.ts";

let configCache: EvilbobConfig | undefined;

export interface Dimensions {
	width: number;
	height: number;
}

export interface EvilbobConfig {
	dimensions: Dimensions;
	plugins: {
		enabled: Record<string, boolean>;
	};
	keybindings: Record<KeybindingKey, Keybinding>;
    search: {
        default: "everywhere" | "by-plugins"
    }
}

export const DEFAULT_CONFIG: EvilbobConfig = {
	dimensions: { width: 800, height: 600 },
	plugins: {
		enabled: {
			colors: true,
			"website-media": true,
			window: true,
			evilbob: true,
			emoji: true,
			"image-conversion": true,
		},
	},
    search: {
        default: "everywhere",
    },
	keybindings: defaultKeybindings,
};

export async function updateConfig(newConfig: Partial<EvilbobConfig>) {
	const currentConfig = await getConfig();
	configCache = undefined;

	const newMergedConfig = deepMerge(currentConfig, newConfig);
	await chrome.storage.sync.set({
		config: newMergedConfig,
	});
}

export async function setConfig(newConfig: Partial<EvilbobConfig>) {
	configCache = undefined;
	await chrome.storage.sync.set({
		config: newConfig,
	});
}

export async function getConfig(forceRefresh = false): Promise<EvilbobConfig> {
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
