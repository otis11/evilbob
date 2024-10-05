import "./dark.css";
import "./light.css";

export const Themes = ["dark", "light"] as const;
type Theme = (typeof Themes)[number];
const defaultTheme: Theme = "dark";
type Dimension = { width: number; height: number };
const defaultDimensions = { width: 800, height: 500 };

export function setCurrentTheme(theme: Theme) {
	chrome.permissions.contains({ permissions: ["storage"] }, (result) => {
		if (result) {
			chrome.storage.sync.set({ theme: theme });
		}
	});
	globalThis.document.documentElement.setAttribute("data-theme", theme);
}

export function setCurrentDimensions(dimensions: Dimension) {
	chrome.permissions.contains({ permissions: ["storage"] }, (result) => {
		if (result) {
			chrome.storage.sync.set({ dimensions: JSON.stringify(dimensions) });
		}
	});
}

export async function getCurrentDimensions(): Promise<Dimension> {
	return new Promise((resolve) => {
		chrome.permissions.contains(
			{ permissions: ["storage"] },
			async (result) => {
				if (result) {
					const storageResult = await chrome.storage.sync.get([
						"dimensions",
					]);
					resolve(
						JSON.parse(
							storageResult.dimensions ||
								JSON.stringify(defaultDimensions),
						),
					);
				} else {
					resolve(defaultDimensions);
				}
			},
		);
	});
}

async function getCurrentTheme(): Promise<Theme> {
	return new Promise((resolve) => {
		chrome.permissions.contains(
			{ permissions: ["storage"] },
			async (result) => {
				if (result) {
					const storageResult = await chrome.storage.sync.get([
						"theme",
					]);
					resolve(storageResult.theme || defaultTheme);
				} else {
					resolve(defaultTheme);
				}
			},
		);
	});
}
(async () => {
	// has a document where theme can be set?
	if (globalThis.document?.documentElement) {
		setCurrentTheme(await getCurrentTheme());
	}
})();
