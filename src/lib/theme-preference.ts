export type ThemePreference = "dark" | "light";
let prefersColorScheme: ThemePreference = window.matchMedia(
	"(prefers-color-scheme: dark)",
).matches
	? "dark"
	: "light";

const listeners: ((preference: ThemePreference) => void)[] = [];
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", (e) => {
		prefersColorScheme = e.matches ? "dark" : "light";
		for (const listener of listeners) {
			listener(prefersColorScheme);
		}
	});

export function onThemePreferenceChange(
	listener: (preference: ThemePreference) => void,
) {
	listeners.push(listener);
}

export function getThemePreference() {
	return prefersColorScheme;
}

export function automaticThemeUpdateDocument() {
	if (getThemePreference() === "dark") {
		document.documentElement.classList.add("dark");
	}

	onThemePreferenceChange((preference) => {
		if (preference === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	});
}
