import { isMac } from "./platform";

export type KeybindingKey = keyof typeof defaultKeybindings;

const ACTION_KEY = isMac ? "Meta" : "Control";

export const defaultKeybindings = {
	selectResult: {
		keys: ["Enter"],
		description: "When selecting a result",
		title: "Select result",
	},
	nextBelow: {
		keys: ["ArrowDown"],
		description: "",
		title: "Next result below",
	},
	nextAbove: {
		keys: ["ArrowUp"],
		description: "",
		title: "Next result above",
	},
	nextRight: {
		keys: ["ArrowRight"],
		description: "",
		title: "Next result right",
	},
	nextLeft: {
		keys: ["ArrowLeft"],
		description: "",
		title: "Next result left",
	},
	close: {
		keys: ["Escape"],
		description: "This will close evil bob.",
		title: "Close evil bob.",
	},
	closePluginView: {
		keys: [ACTION_KEY, "b"],
		description: "This will close the plugin view.",
		title: "Close plugin view.",
	},
	openActions: {
		keys: [ACTION_KEY, "Enter"],
		description: "This will open the actions for a View.",
		title: "Open Actions.",
	},
};

const KEYS_ICONS_MAP: Record<string, string> = {
	Meta: "⌘",
	Enter: "⏎",
};
export function keysAsString(keys: string[] | undefined): string {
	if (!keys) {
		return "";
	}
	let result = "";
	for (let i = 0; i < keys.length; i++) {
		result += KEYS_ICONS_MAP[keys[i] || ""] || keys[i];
	}
	return result;
}
