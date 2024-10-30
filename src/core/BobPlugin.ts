import type { Result } from "./components/result/result";
import type { Search } from "./components/search";
import type { Locale } from "./locales";
import type { BrowserName } from "./platform";

export function defineBobPlugin(plugin: BobPlugin) {
	return plugin;
}

export type BobPlugin = {
	// required
	name(): string;

	// optional
	permissions?: string[];
	hostPermissions?: string[];
	supportedBrowsers?: BrowserName[];
	prefix?: string;
	icon?: string;
	description?(): string;
	provideResults?(): Promise<Result[]>;
	provideTheme?(): Promise<string>;
	provideConfig?(): BobPluginConfig;

	// optional hooks
	onBobWindowBlur?(state: BobWindowState): void;
	onBobWindowFocus?(state: BobWindowState): void;
	onBobWindowOpen?(state: BobWindowState): void;
	onLocalChange?(state: BobWindowState): void;

	// set from extension on load. dont set yourself, will get overwritten
	id?: string;
};

export type BobWindowState = {
	win: Window & typeof globalThis;
	input: HTMLInputElement;
	currentSearch: Search;
	optionsInput: HTMLInputElement;
	isOptionsVisible: boolean;
	optionsSelectedResult: Result;
	locale: Locale;
	closeResultOptions: () => void;
	results: Result[];
};

export type BobPluginConfig = {
	[key: string]: {
		value: number | string | string[] | number[];
		description?: string;
	};
};
