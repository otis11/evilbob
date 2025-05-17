import { normalizeKey } from "@/lib/utils.ts";

let currentPressedDownKeys: Record<string, boolean> = {};

window.addEventListener("keydown", (event: KeyboardEvent) => {
	currentPressedDownKeys[normalizeKey(event.key)] = true;
});

window.addEventListener("keyup", (event: KeyboardEvent) => {
	if (event.key === "Meta") {
		currentPressedDownKeys = {};
		return;
	}
	delete currentPressedDownKeys[normalizeKey(event.key)];
});

window.addEventListener("evilbob-keydown", (event: Event) => {
	if ("detail" in event && event.detail instanceof KeyboardEvent) {
		currentPressedDownKeys[normalizeKey(event.detail.key)] = true;
	}
});

window.addEventListener("evilbob-keyup", (event: Event) => {
	if ("detail" in event && event.detail instanceof KeyboardEvent) {
		if (event.detail.key === "Meta") {
			currentPressedDownKeys = {};
			return;
		}
		delete currentPressedDownKeys[normalizeKey(event.detail.key)];
	}
});

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
	keyupHandler: (e: Event) => void;
	keydownHandler: (e: Event) => void;

	constructor(
		private readonly targets: (
			| HTMLElement
			| Window
			| Document
			| ShadowRoot
			| null
		)[],
	) {
		for (const key of Object.keys(currentPressedDownKeys)) {
			this.keysPressedDown[key] = true;
		}
		this.keyupHandler = (keyboardEvent: Event) => {
			if (keyboardEvent instanceof KeyboardEvent) {
				// this only needs to be tracked because of macOS and the Meta key. The Meta key does not trigger keyup event for keys while its pressed.
				// if key not held down emulate the key up event for that specific key.
				// this is not perfect, as holding multiple keys down at once triggers only 1 keydown event for the last key pressed.
				// https://github.com/electron/electron/issues/5188
				if (keyboardEvent.key === "Meta") {
					this.keysPressedDown = {};
					return;
				}
				delete this.keysPressedDown[normalizeKey(keyboardEvent.key)];
			}
		};

		this.keydownHandler = (keyboardEvent) => {
			if (keyboardEvent instanceof KeyboardEvent) {
				const normalizedKey = normalizeKey(keyboardEvent.key);
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
		};

		for (const target of this.targets) {
			if (target === null) {
				continue;
			}
			target.addEventListener("keyup", this.keyupHandler.bind(this));
			target.addEventListener("keydown", this.keydownHandler.bind(this));
		}
	}

	register(keys: string[], onActivate: () => void, onLeave?: () => void) {
		if (keys.length === 0) {
			return -1;
		}
		this.keydownListener.push({
			keys: keys.map((key) => normalizeKey(key)),
			onActivate,
			onLeave,
			isActive: false,
			id: this.keydownListenerIdCounter,
		});
		this.keydownListenerIdCounter += 1;
		return this.keydownListenerIdCounter - 1;
	}
	remove(id: number) {
		this.keydownListener = this.keydownListener.filter(
			(listener) => listener.id !== id,
		);
	}
	destroy() {
		this.keysPressedDown = {};
		this.keydownListenerIdCounter = 0;
		this.keydownListener = [];
		for (const target of this.targets) {
			if (target === null) {
				continue;
			}
			target.removeEventListener("keyup", this.keyupHandler.bind(this));
			target.removeEventListener(
				"keydown",
				this.keydownHandler.bind(this),
			);
		}
	}
}
