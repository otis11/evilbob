import "./dark.css";
import "./light.css";

export const Themes = ["dark", "light"] as const;
type Theme = (typeof Themes)[number];
const defaultTheme: Theme = "dark";
type Dimension = { width: number; height: number };
const defaultDimensions = { width: 800, height: 500 };

export function setCurrentTheme(theme: Theme) {
	chrome.storage.sync.set({ theme: theme });
	if (globalThis.document?.documentElement) {
		globalThis.document.documentElement.setAttribute("data-theme", theme);
	}
}

export function setCurrentDimensions(dimensions: Dimension) {
	chrome.storage.sync.set({ dimensions: JSON.stringify(dimensions) });
}

export async function getCurrentDimensions(): Promise<Dimension> {
	const storageResult = await chrome.storage.sync.get(["dimensions"]);
	return JSON.parse(
		storageResult.dimensions || JSON.stringify(defaultDimensions),
	);
}

async function getCurrentTheme(): Promise<Theme> {
	const storageResult = await chrome.storage.sync.get(["theme"]);
	return storageResult.theme || defaultTheme;
}
(async () => {
	if (globalThis.document?.documentElement) {
		globalThis.document.documentElement.setAttribute(
			"data-theme",
			await getCurrentTheme(),
		);
	}
})();
