// @ts-expect-error typescript doesnt know dark.css?raw as a file
import defaultCustomTheme from "../themes/dark.css?raw";
import { type Theme, defaultTheme } from "./themes";

type Dimension = { width: number; height: number };
const defaultWindowDimensions = { width: 900, height: 600 };

export async function setCurrentTheme(theme: Theme) {
	await chrome.storage.sync.set({ theme: theme });
	if (globalThis.document?.documentElement) {
		if (theme === "custom") {
			await loadCustomTheme();
		}
		globalThis.document.documentElement.setAttribute("data-theme", theme);
	}
}

async function loadCustomTheme() {
	const theme = await getCustomTheme();
	const style = document.createElement("style");
	style.textContent = theme;
	globalThis.document.head.append(style);
}

export async function setCustomTheme(theme: string) {
	await chrome.storage.sync.set({ customTheme: theme });
}

export async function getCustomTheme() {
	const storageResult = await chrome.storage.sync.get(["customTheme"]);
	return (
		storageResult.customTheme ||
		defaultCustomTheme.replace(
			'[data-theme="dark"]',
			'[data-theme="custom"]',
		)
	);
}

export async function setCurrentDimensions(dimensions: Dimension) {
	await chrome.storage.sync.set({ dimensions: JSON.stringify(dimensions) });
}

export async function getCurrentDimensions(): Promise<Dimension> {
	const storageResult = await chrome.storage.sync.get(["dimensions"]);
	return JSON.parse(
		storageResult.dimensions || JSON.stringify(defaultWindowDimensions),
	);
}

async function getCurrentTheme(): Promise<Theme> {
	const storageResult = await chrome.storage.sync.get(["theme"]);
	return storageResult.theme || defaultTheme;
}
(async () => {
	if (globalThis.document?.documentElement) {
		const theme = await getCurrentTheme();
		if (theme === "custom") {
			await loadCustomTheme();
		}
		globalThis.document.documentElement.setAttribute("data-theme", theme);
	}
})();

export async function setThemeToDefaults() {
	await setCurrentDimensions(defaultWindowDimensions);
	await setCurrentTheme(defaultTheme);
}
