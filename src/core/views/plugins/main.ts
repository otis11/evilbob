import { getConfig } from "../../config";
import { coreI18n } from "../../locales";
import { loadPlugins } from "../../plugins";
import { loadTheme } from "../../theme";
import { renderFooter } from "../options/footer";
import { renderPlugins } from "./plugins";
import "../../global.css";
import "./main.css";

(async () => {
	await loadPlugins();
	await loadTheme();
	const config = await getConfig();
	coreI18n.setLocale(config.locale);
	await renderPlugins(config);
	renderFooter();
})();
