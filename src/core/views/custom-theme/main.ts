import { getConfig, updateConfig } from "../../config";
import { coreI18n } from "../../locales";
import "../../theme";
import { debounce } from "../../util/debounce";
import "../../global.css";
import "./main.css";

const preview = document.getElementById("preview") as HTMLElement;
const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
getConfig().then((config) => {
	coreI18n.setLocale(config.locale);
	textarea.value = config.customTheme;
});

textarea.addEventListener("input", () => {
	debounce(() => {
		updateConfig({
			customTheme: textarea.value,
		});
	});
});
