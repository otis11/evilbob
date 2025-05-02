export interface CopyToClipboardProps {
	"image/png": Blob;
	"image/jpeg": Blob;
	"image/gif": Blob;
	"text/plain": string;
}

export async function copyTextToClipboard(text: string) {
	const type = "text/plain";
	const clipboardItemData = {
		[type]: text,
	};
	const clipboardItem = new ClipboardItem(clipboardItemData);
	await navigator.clipboard.write([clipboardItem]);
}

export async function copyImageToClipboard(url: string) {
	const data = await fetch(url);
	const blob = await data.blob();
	await navigator.clipboard.write([
		new ClipboardItem({
			[blob.type]: blob,
		}),
	]);
}

export async function getClipboard() {
	return await navigator.clipboard.read();
}
export function deepMerge(
	// biome-ignore lint: any
	target: Record<string, any>,
	// biome-ignore lint: any
	source: Record<string, any>,
) {
	for (const key in source) {
		if (Object.hasOwn(source, key)) {
			if (isJsObject(source[key])) {
				if (!Object.hasOwn(source, key)) continue;
				// https://github.com/otis11/evil-bob/security/code-scanning/1
				if (key === "__proto__" || key === "constructor") continue;
				if (
					!target[key] ||
					typeof target[key] !== "object" ||
					Array.isArray(target[key])
				) {
					target[key] = {};
				}
				deepMerge(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
}

// biome-ignore lint: any
function isJsObject(obj: any) {
	return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}
export function findStringStartUntil(
	haystack: string,
	start: string,
	until: string,
): [boolean, string] {
	let valueFound = "";
	let isFound = false;
	for (let i = 0; i < haystack.length; i++) {
		if (haystack[i] === start) {
			isFound = true;
			continue;
		}
		if (isFound && haystack[i] === until) {
			break;
		}
		if (isFound) {
			valueFound += haystack[i];
		}
	}
	return [isFound, valueFound];
}
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
