export type KeybindingKey = keyof typeof defaultKeybindings;

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
		keys: ["Meta", "b"],
		description: "This will close the plugin view.",
		title: "Close plugin view.",
	},
};
