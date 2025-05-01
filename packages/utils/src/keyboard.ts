export class KeyboardListener {
	keysPressedDown: Record<string, boolean> = {};
	keydownListenerIdCounter = 0;
	keydownListener: {
		keys: string[];
		onActivate: () => void;
		onLeave?: () => void;
		isActive: boolean;
		id: number;
	}[] = [];

	constructor(target: HTMLElement | Window | Document | ShadowRoot) {
		target.addEventListener("keyup", (keyboardEvent) => {
			if (keyboardEvent instanceof KeyboardEvent) {
				// this only needs to be tracked because of macOS and the Meta key. The Meta key does not trigger keyup event for keys while its pressed.
				// if key not held down emulate the key up event for that specific key.
				// this is not perfect, as holding multiple keys down at once triggers only 1 keydown event for the last key pressed.
				// https://github.com/electron/electron/issues/5188
				if (keyboardEvent.key === "Meta") {
					this.keysPressedDown = {};
					return;
				}
				delete this.keysPressedDown[
					this.normalizeKey(keyboardEvent.key)
				];
			}
		});

		target.addEventListener("keydown", (keyboardEvent) => {
			if (keyboardEvent instanceof KeyboardEvent) {
				const normalizedKey = this.normalizeKey(keyboardEvent.key);
				this.keysPressedDown[normalizedKey] = true;

				for (const listener of this.keydownListener) {
					// check for same
					let shouldTrigger =
						listener.keys.length ===
						Object.keys(this.keysPressedDown).length;
					if (shouldTrigger) {
						// check for each key to be the same
						for (const key of listener.keys) {
							if (!this.keysPressedDown[key]) {
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
			}
		});
	}

	normalizeKey(key: string) {
		if (key.length === 1) {
			return key.toLowerCase();
		}
		return key;
	}

	register(keys: string[], onActivate: () => void, onLeave?: () => void) {
		if (keys.length === 0) {
			return;
		}
		this.keydownListener.push({
			keys: keys.map((key) => this.normalizeKey(key)),
			onActivate,
			onLeave,
			isActive: false,
			id: this.keydownListenerIdCounter,
		});
		this.keydownListenerIdCounter += 1;
		return this.keydownListenerIdCounter - 1;
	}
}
