import { loadCustomTheme } from "../../theme";
import "../../theme";
import "../global.css";
import "./main.css";
import { getConfig } from "../../config";
import { renderBobDimensions } from "./dimensions";
import { renderFooter } from "./footer";
import { renderHeader } from "./header";
import { renderPreserveInput } from "./preserve-input";
import { renderResultGroups } from "./result-groups";
import { renderThemes } from "./themes";

(async () => {
	const config = await getConfig();
	renderHeader();
	await renderResultGroups(config);
	renderPreserveInput(config);
	await renderBobDimensions(config);
	renderThemes(config);
	renderFooter();
	await loadCustomTheme();
})();
