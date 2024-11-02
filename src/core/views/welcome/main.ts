import {
	PluginsLink,
	SettingsLink,
	makeExternalLink,
} from "../../components/internal-links";
import "../../global.css";
import "./main.css";
import { loadTheme } from "../../theme";

loadTheme();

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

renderHeader();
