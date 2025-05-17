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

export function rgbaStyleToHex(str: string) {
	if (!str.includes("rgb")) {
		throw new Error("Only rgb and rgba values supported.");
	}
	if (str.indexOf("rgb") !== str.lastIndexOf("rgb")) {
		throw new Error("Multiple rgb values not supported.");
	}
	const colorFormat = str.startsWith("rgba") ? "rgba" : "rgb";
	const colorValuesOnly = str.replace(`${colorFormat}(`, "").replace(")", "");
	const [r, g, b, a] = colorValuesOnly
		.split(",")
		.map((s) => Number.parseInt(s));
	return rgbaToHex({ r: r || 0, g: g || 0, b: b || 0, a: a || 255 });
}
