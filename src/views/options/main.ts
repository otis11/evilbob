import { loadCustomTheme } from "../../theme";
import "../../theme";
import "../global.css";
import "./main.css";
import { FlexContainer } from "../../components/flex-container";
import { GroupHeading } from "../../components/group-heading";
import { type BobConfig, getConfig, updateConfig } from "../../config";
import { LOCALES, type Locale, setLocale } from "../../locale";
import { renderBobDimensions } from "./dimensions";
import { renderFooter } from "./footer";
import { renderHeader } from "./header";
import { renderOnBobWindowEvents } from "./on-bob-window-events";
import { renderResultGroups } from "./result-groups";
import { renderThemes } from "./themes";

(async () => {
	const config = await getConfig();
	setLocale(config.locale);
	renderHeader();
	await renderResultGroups(config);
	renderOnBobWindowEvents(config);
	await renderBobDimensions(config);
	renderLocales(config);
	renderThemes(config);
	renderFooter();
	await loadCustomTheme();
})();

function renderLocales(config: BobConfig) {
	const container = FlexContainer({ flexDirection: "column" });
	const select = document.createElement("select");

	select.addEventListener("change", () => {
		updateConfig({
			locale: select.value as Locale,
		});
	});
	for (const locale of LOCALES) {
		const option = document.createElement("option");
		option.innerText = locale;
		option.value = locale;
		select.style.width = "120px";
		if (locale === config.locale) {
			option.selected = true;
		}
		select.append(option);
	}

	container.append(GroupHeading("Locale"), select);
	document.body.append(container);
}
