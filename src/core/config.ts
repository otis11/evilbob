// @ts-expect-error TODO add ?raw to types in global.d.ts as well, fine for now.
import darkTheme from "../plugins/bob-dark-theme/dark.css?raw";
import type { BobPluginConfig } from "./BobPlugin";
import type { Locale } from "./locales";
import type { Dimensions } from "./theme";
import { deepMerge } from "./util/deep-merge";

let configCache: BobConfig | null = null;

export type KeybindingKey = keyof typeof defaultKeybindings;

const defaultKeybindings = {
	selectResult: {
		keys: ["Enter"],
		description: "When selecting a result",
		title: "Select result",
	},
	openResultOptions: {
		keys: ["Shift", "Enter"],
		description: "When opening the result options",
		title: "Open result options",
	},
	nextResult: {
		keys: ["ArrowDown"],
		description: "",
		title: "Next result",
	},
	previousResult: {
		keys: ["ArrowUp"],
		description: "",
		title: "Previous result",
	},
	close: {
		keys: ["Escape"],
		description: "This will hide the bob command palette window or close the options opened for a command. To close the bob window and not only hide it, enable the 'On bob leave close window' plugin.",
		title: "Hide bob or close the options of a command.",
	},
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
	keybindings: Partial<
		Record<
			KeybindingKey,
			{ keys: string[]; description?: string; title?: string }
		>
	>;
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
	keybindings: defaultKeybindings,
	theme: "dark",
	customTheme: darkTheme,
};

export async function updateConfig(newConfig: Partial<BobConfig>) {
	const currentConfig = await getConfig(true);

	const newMergedConfig = deepMerge(currentConfig, newConfig);
	await chrome.storage.sync.set({
		config: newMergedConfig,
	});

	try {
		await chrome.runtime.sendMessage(chrome.runtime.id, {
			type: "bob.config.change",
			data: newMergedConfig,
		});
	} catch (e) {
		console.error(e);
	}
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

export async function getConfig(refreshCache = false): Promise<BobConfig> {
	if (refreshCache) {
		configCache = null;
	}

	if (!configCache) {
		configCache =
			(await chrome.storage.sync.get(["config"])).config ||
			DEFAULT_CONFIG;
	}
	return configCache || DEFAULT_CONFIG;
}
