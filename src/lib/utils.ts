import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export interface CopyToClipboardProps {
	"image/png": Blob;
	"image/jpeg": Blob;
	"image/gif": Blob;
	"text/plain": string;
}

export async function copyTextToClipboard(text: string) {
	return await navigator.clipboard
		.writeText(text)
		.then(() => true)
		.catch(() => false);
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
				// https://github.com/otis11/evilbob/security/code-scanning/1
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
export interface Rgba {
	r: number;
	g: number;
	b: number;
	a: number;
}
export type RgbaKey = keyof Rgba;
export function rgbaToHex({ r, g, b, a }: Rgba) {
	return `#${`0${decimalToHex(r)}`.slice(-2)}${`0${decimalToHex(g)}`.slice(-2)}${`0${decimalToHex(b)}`.slice(-2)}${`0${decimalToHex(a)}`.slice(-2)}`;
}

export function hexToRgba(hexStr: string): Rgba {
	let str = hexStr.toUpperCase();
	if (str.startsWith("#")) {
		str = str.slice(1);
	}
	const chunks = chunkString(str, 2);

	return {
		r: hexToDecimal(chunks[0]),
		g: hexToDecimal(chunks[1]),
		b: hexToDecimal(chunks[2]),
		a: hexToDecimal(chunks[3]),
	};
}

export function normalizeKey(key: string) {
	if (key.length === 1) {
		return key.toLowerCase();
	}
	return key;
}

export function chunkString(str: string, chunkSize: number) {
	const chunks: string[] = [];
	for (let i = 0; i < str.length; i += chunkSize) {
		chunks.push(str.slice(i, i + chunkSize));
	}
	return chunks;
}

export function decimalToHex(n: number) {
	return n.toString(16);
}

export function hexToDecimal(hexStr: string | undefined) {
	if (hexStr === undefined) {
		return 0;
	}
	let sum = 0;
	for (let i = 0; i < hexStr.length; i++) {
		const char = hexStr[i];
		if (char === undefined || HEX_CHAR_NUMBER_MAP[char] === undefined) {
			throw new Error(`Invalid hex number: ${hexStr}`);
		}
		sum += HEX_CHAR_NUMBER_MAP[char] * 16 ** (hexStr.length - 1 - i);
	}
	return sum;
}

const HEX_CHAR_NUMBER_MAP: Record<string, number> = {
	"0": 0,
	"1": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	A: 10,
	B: 11,
	C: 12,
	D: 13,
	E: 14,
	F: 15,
};

export function getFaviconUrl(urlStr: string | undefined) {
	if (!urlStr) {
		return "";
	}
	const url = new URL(urlStr);
	return `${url.origin}/favicon.ico`;
}

export function formatTimeAgo(unix: number | undefined): string {
	if (!unix) {
		return "";
	}
	const now = new Date();
	const diffInMs = now.getTime() - unix;
	if (diffInMs < 1000 * 60) {
		return "now";
	}
	if (diffInMs < 1000 * 60 * 60) {
		return `${Math.floor(diffInMs / 1000 / 60)} minutes ago`;
	}
	if (diffInMs < 1000 * 60 * 60 * 24) {
		return `${Math.floor(diffInMs / 1000 / 60 / 60)} hours ago`;
	}
	if (diffInMs < 1000 * 60 * 60 * 24 * 31) {
		return `${Math.floor(diffInMs / 1000 / 60 / 60 / 24)} days ago`;
	}
	if (diffInMs < 1000 * 60 * 60 * 24 * 365) {
		return `${Math.floor(diffInMs / 1000 / 60 / 60 / 24)} days ago`;
	}
	return new Date(unix).toLocaleDateString("en-US", {});
}

export function formatTimeFuture(unix: number | undefined): string {
	if (!unix) {
		return "";
	}
	const now = new Date();
	const diffInMs = unix - now.getTime();
	if (diffInMs < 1000 * 60) {
		return "now";
	}
	if (diffInMs < 1000 * 60 * 60) {
		return `${Math.floor(diffInMs / 1000 / 60)} minutes`;
	}
	if (diffInMs < 1000 * 60 * 60 * 24) {
		return `${Math.floor(diffInMs / 1000 / 60 / 60)} hours`;
	}
	if (diffInMs < 1000 * 60 * 60 * 24 * 31) {
		return `${Math.floor(diffInMs / 1000 / 60 / 60 / 24)} days`;
	}
	if (diffInMs < 1000 * 60 * 60 * 24 * 365) {
		return `${Math.floor(diffInMs / 1000 / 60 / 60 / 24)} days`;
	}
	return new Date(unix).toLocaleDateString("en-US", {});
}

export function getSecondLevelDomain(urlString: string) {
	const url = new URL(urlString);
	return url.hostname.split(".").at(-2) || "";
}

export function getDomainWithoutSubdomains(urlString: string) {
	const url = new URL(urlString);
	return `${url.hostname.split(".").at(-2) || ""}.${url.hostname.split(".").at(-1) || ""}`;
}

export function unique(str: string, list: string[]) {
	let number = 0;
	function uniqueStr() {
		return number > 0 ? `${str} ${number}` : str;
	}

	while (true) {
		const sameStrFound = list.find((l) => l === uniqueStr());
		if (!sameStrFound) {
			break;
		}
		number += 1;
	}
	return uniqueStr();
}

//biome-ignore lint/suspicious/noExplicitAny: can be any
export function errorToJson(err: any) {
	//biome-ignore lint/suspicious/noExplicitAny: can be any
	const data: Record<string, any> = {};
	for (const key of Object.getOwnPropertyNames(err)) {
		try {
			data[key] = err[key];
		} catch {}
	}
	return data;
}

export function markElementInDocument(el: HTMLElement | SVGElement) {
	el.style.setProperty("border", "5px solid red", "important");
	el.style.setProperty("filter", "none", "important");
	el.scrollIntoView({ block: "center", behavior: "smooth" });
}

export function downloadUrl(url: string, title?: string) {
	const link = document.createElement("a");
	link.href = url;
	link.download = title || "download";
	link.click();
	link.remove();
}
