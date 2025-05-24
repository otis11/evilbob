import { isMac } from "./platform";

export type KeybindingKey = keyof typeof defaultKeybindings;
export type Keybinding = {
	keys: string[];
	description?: string;
	title?: string;
};

export const ACTION_KEY = isMac ? "Meta" : "Control";

export const defaultKeybindings = {
	selectResult: {
		keys: ["Enter"],
		description: "Keybinding to select a result in a list",
		title: "Select result",
	},
	nextBelow: {
		keys: ["ArrowDown"],
		description: "Keybinding to select the next result below in a list",
		title: "Next result below",
	},
	nextAbove: {
		keys: ["ArrowUp"],
		description: "Keybinding to select the next result above in a list",
		title: "Next result above",
	},
	nextRight: {
		keys: ["ArrowRight"],
		description:
			"Keybinding to select the next result to the right in a list",
		title: "Next result right",
	},
	nextLeft: {
		keys: ["ArrowLeft"],
		description:
			"Keybinding to select the next result to the left in a list",
		title: "Next result left",
	},
	close: {
		keys: ["Escape"],
		description: "Keybinding to close Evilbob",
		title: "Close Evilbob.",
	},
	closePluginView: {
		keys: [ACTION_KEY, "x"],
		description: "Keybinding to close the active plugin view",
		title: "Close plugin view.",
	},
	openActions: {
		keys: [ACTION_KEY, "Enter"],
		description:
			"Keybinding to open the actions for list item or a plugin command",
		title: "Open Actions.",
	},
};

const KEYS_ICONS_MAP: Record<string, string> = {
	Meta: "⌘",
	Enter: "⏎",
	Shift: "⇧",
	Option: "⎇",
	ArrowLeft: "←",
	ArrowDown: "↓",
	ArrowRight: "→",
	ArrowUp: "↑",
};
export function keysAsString(keys: string[] | undefined): string[] {
	if (!keys) {
		return [];
	}
	const result = [];
	for (let i = 0; i < keys.length; i++) {
		result.push(KEYS_ICONS_MAP[keys[i] || ""] || keys[i] || "");
	}
	return result;
}
