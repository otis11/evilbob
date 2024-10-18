import "./dark.css";
import "./light.css";

export const Themes = ["dark", "light"] as const;
type Theme = (typeof Themes)[number];
const defaultTheme: Theme = "dark";
type Dimension = { width: number; height: number };
const defaultDimensions = { width: 900, height: 600 };

export async function setCurrentTheme(theme: Theme) {
	await chrome.storage.sync.set({ theme: theme });
	if (globalThis.document?.documentElement) {
		globalThis.document.documentElement.setAttribute("data-theme", theme);
	}
}

export async function setCurrentDimensions(dimensions: Dimension) {
	await chrome.storage.sync.set({ dimensions: JSON.stringify(dimensions) });
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

export async function setThemeToDefaults() {
	await setCurrentDimensions(defaultDimensions);
	await setCurrentTheme(defaultTheme);
}
