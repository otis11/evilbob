let keysPressedDown: Record<string, boolean> = {};
const keydownListener: {
	keys: string[];
	onActivate: () => void;
	onLeave?: () => void;
	isActive: boolean;
}[] = [];

window.addEventListener("keydown", (keyboardEvent) => {
	const normalizedKey = normalizeKey(keyboardEvent.key);
	keysPressedDown[normalizedKey] = true;

	for (const listener of keydownListener) {
		// check for same
		let shouldTrigger =
			listener.keys.length === Object.keys(keysPressedDown).length;
		if (shouldTrigger) {
			// check for each key to be the same
			for (const key of listener.keys) {
				if (!keysPressedDown[key]) {
					shouldTrigger = false;
					break;
				}
			}
		}
		if (shouldTrigger) {
			listener.onActivate();
		}
		if (!shouldTrigger && listener.isActive) {
			listener.isActive = false;
			listener.onLeave?.();
		}
	}
});

export function normalizeKey(key: string) {
	if (key.length === 1) {
		return key.toLowerCase();
	}
	return key;
}

window.addEventListener("keyup", (keyboardEvent) => {
	// this only needs to be tracked because of macos and metakey. Metakey does not trigger keyup event for keys while its pressed.
	// if key not held down emulate the key up event for that specific key.
	// this is not perfect, as holding mutliple keys down at once triggers only 1 keydown event for the last key pressed.
	// https://github.com/electron/electron/issues/5188
	if (keyboardEvent.key === "Meta") {
		keysPressedDown = {};
		return;
	}
	delete keysPressedDown[normalizeKey(keyboardEvent.key)];
});

export function registerKeysListener(
	keys: string[],
	onActivate: () => void,
	onLeave?: () => void,
) {
	if (keys.length === 0) {
		return;
	}
	keydownListener.push({
		keys: keys.map((key) => normalizeKey(key)),
		onActivate,
		onLeave,
		isActive: false,
	});
}
