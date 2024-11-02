import { iconFromString, iconOpenInNew } from "../icons";
import { Span } from "./elements";
import { FlexContainer } from "./flex-container";

export function PluginsLink(onClick?: () => void) {
	const pluginsLinkElement = FlexContainer({
		gap: "4px",
		alignItems: "center",
	});
	pluginsLinkElement.append(iconFromString(iconOpenInNew), Span("Plugins"));
	pluginsLinkElement.style.paddingTop = "20px";
	pluginsLinkElement.style.cursor = "pointer";
	pluginsLinkElement.addEventListener("click", () => {
		chrome.tabs.create({ url: "/src/core/views/plugins/index.html" });
		onClick?.();
	});
	pluginsLinkElement.style.color = "var(--bob-color-primary)";
	return pluginsLinkElement;
}
