import "./dark.css";
import "./light.css";

export const Themes = ["dark", "light"] as const;
type Theme = (typeof Themes)[number];
const defaultTheme: Theme = "dark";

export function setCurrentTheme(theme: Theme) {
	chrome.permissions.contains({ permissions: ["storage"] }, (result) => {
		if (result) {
			chrome.storage.sync.set({ theme: theme });
		}
	});
	globalThis.document.documentElement.setAttribute("data-theme", theme);
}

async function getCurrentTheme(): Promise<Theme> {
	return new Promise((resolve) => {
		chrome.permissions.contains(
			{ permissions: ["storage"] },
			async (result) => {
				if (result) {
					const result = await chrome.storage.sync.get(["theme"]);
					resolve(result.theme || defaultTheme);
				} else {
					resolve(defaultTheme);
				}
			},
		);
	});
}
(async () => {
	setCurrentTheme(await getCurrentTheme());
})();
