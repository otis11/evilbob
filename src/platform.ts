const userAgent =
	typeof navigator !== "undefined"
		? navigator.userAgent.toLowerCase()
		: "idk";
const platform =
	typeof navigator !== "undefined" ? navigator.platform.toLowerCase() : "idk";

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
