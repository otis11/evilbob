import { ThemeCard } from "../../components/theme-card/theme-card";
import { getConfig, updateConfig } from "../../config";
import { setLocale } from "../../locale";
import "../../theme";
import { loadCustomTheme } from "../../theme";
import { debounce } from "../../util/debounce";
import "../global.css";
import "./main.css";

const preview = document.getElementById("preview") as HTMLElement;
const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
getConfig().then((config) => {
	setLocale(config.locale);
	textarea.value = config.customTheme;
});

textarea.addEventListener("input", () => {
	debounce(() => {
		updateConfig({
			customTheme: textarea.value,
		});
		loadCustomTheme();
	});
});

preview.innerHTML = ThemeCard("custom").outerHTML;
loadCustomTheme();
