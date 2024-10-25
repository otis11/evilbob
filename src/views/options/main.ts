import { loadCustomTheme } from "../../theme";
import "../../theme";
import "../global.css";
import "./main.css";
import { renderBobDimensions } from "./dimensions";
import { renderFooter } from "./footer";
import { renderHeader } from "./header";
import { renderResultGroups } from "./result-groups";
import { renderThemes } from "./themes";

(async () => {
	renderHeader();
	await renderResultGroups();
	await renderBobDimensions();
	renderThemes();
	renderFooter();
	await loadCustomTheme();
})();
