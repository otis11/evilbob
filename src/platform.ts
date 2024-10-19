const userAgent =
	typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
export const platform =
	typeof navigator !== "undefined" ? navigator.platform.toLowerCase() : "";

export const isChromium =
	userAgent.includes("chrome") || userAgent.includes("chromium");
export const isFirefox =
	userAgent.includes("firefox") ||
	userAgent.includes("thunderbird") ||
	userAgent.includes("librewolf");
export const isEdge = userAgent.includes("edg");
export const isSafari = userAgent.includes("safari") && !isChromium;
export const isWindows = platform.startsWith("win");
export const isMac = platform.startsWith("mac");
export const isMobile = userAgent.includes("mobile");

export type BrowserName =
	| "chromium"
	| "firefox"
	| "chrome"
	| "edg"
	| "librewolf";

export const browserName = (() => {
	const match = userAgent.match(
		/firefox|librewolf|chrom(?:e|ium)|safari|edg/i,
	);
	if (match?.[0]) {
		return match[0] as BrowserName;
	}
	return "" as BrowserName;
})();
export const browserVersion = (() => {
	const match = userAgent.match(
		new RegExp(`(?:${browserName})(?:\/| )([^ ]+)`),
	);
	if (match?.[1]) {
		return match[1];
	}
	return "";
})();
