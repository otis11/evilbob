import {
	PluginsLink,
	SettingsLink,
	makeExternalLink,
} from "../../components/internal-links";
import "../../global.css";
import "./main.css";
import { isMac } from "../../platform.ts";
import { loadTheme } from "../../theme";

export function renderHeader() {
	const links = document.getElementById("links");
	links?.append(
		PluginsLink(),
		SettingsLink(),
		makeExternalLink(
			"FAQ",
			"https://otis11.github.io/bob-command-palette#faq",
		),
		makeExternalLink(
			"GitHub",
			"https://github.com/otis11/bob-command-palette",
		),
	);
}
(async () => {
	await loadTheme();
	renderHeader();
	const openShortcutHeader = document.getElementById("open-bob-shortcut");
	if (openShortcutHeader) {
		openShortcutHeader.innerHTML = `<kbd>${isMac ? "⌘" : "Ctrl"}</kbd><kbd>Shift</kbd><kbd>L</kbd>`;
	}
})();
