import { FlexContainer } from "../../components/flex-container";
import { Span } from "../../components/span";
import { iconFromString, iconOpenInNew } from "../../icons";
import { isChromium } from "../../platform";

export function renderHeader() {
	const header = document.createElement("header");

	const shortcutText = document.createElement("p");
	const shortcutLink = isChromium
		? "chrome://extensions/shortcuts"
		: "about:addons";
	const specificNotice = isChromium
		? "Setting it to Global makes the shortcut system wide!"
		: 'Click the settings icon in the right corner. Choose "Manage Extension Shortcuts"';
	shortcutText.innerHTML = `Hi! Go to <strong style="color: var(--bob-color-primary)">${shortcutLink}</strong> to set a shortcut to open Bob. ${specificNotice}`;
	header.append(shortcutText);
	const pluginHeading = FlexContainer({ gap: "4px", alignItems: "center" });
	pluginHeading.append(iconFromString(iconOpenInNew), Span("Plugins"));
	pluginHeading.style.paddingTop = "20px";
	pluginHeading.style.cursor = "pointer";
	pluginHeading.addEventListener("click", () => {
		chrome.tabs.create({ url: "/src/core/views/plugins/index.html" });
	});
	pluginHeading.style.color = "var(--bob-color-primary)";
	document.body.append(header, pluginHeading);
}
