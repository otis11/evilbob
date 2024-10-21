import { ThemeCard } from "../../components/theme-card/theme-card";
import "../../theme";
import { getCustomTheme, loadCustomTheme, setCustomTheme } from "../../theme";
import { debounce } from "../../util/debounce";
import "../global.css";
import "./main.css";

const preview = document.getElementById("preview") as HTMLElement;
const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
getCustomTheme().then((theme) => {
	textarea.value = theme;
});

textarea.addEventListener("input", () => {
	debounce(() => {
		setCustomTheme(textarea.value);
		loadCustomTheme();
	});
});

preview.innerHTML = ThemeCard("custom").outerHTML;
