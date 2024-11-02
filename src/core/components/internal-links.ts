import { iconFromString, iconOpenInNew } from "../icons";
import { Span } from "./elements";
import { FlexContainer } from "./flex-container";

export function PluginsLink(onClick?: () => void) {
	return LinkCreateTab(
		"/src/core/views/plugins/index.html",
		"Plugins",
		onClick,
	);
}

export function SettingsLink(onClick?: () => void) {
	return LinkCreateTab(
		"/src/core/views/options/index.html",
		"Settings",
		onClick,
	);
}

export function WelcomeLink(onClick?: () => void) {
	return LinkCreateTab(
		"/src/core/views/welcome/index.html",
		"Welcome",
		onClick,
	);
}

export function CustomThemeLink(onClick?: () => void) {
	return LinkCreateTab(
		"/src/core/views/custom-theme/index.html",
		"Edit Custom Theme",
		onClick,
	);
}

export function LinkCreateTab(url: string, text: string, onClick?: () => void) {
	const pluginsLinkElement = FlexContainer({
		gap: "4px",
		alignItems: "center",
	});
	pluginsLinkElement.append(iconFromString(iconOpenInNew), Span(text));
	pluginsLinkElement.style.cursor = "pointer";
	pluginsLinkElement.addEventListener("click", () => {
		chrome.tabs.create({ url });
		onClick?.();
	});
	pluginsLinkElement.style.color = "var(--bob-color-primary)";
	return pluginsLinkElement;
}

export function makeExternalLink(text: string, href: string) {
	const link = document.createElement("a");
	link.style.display = "flex";
	link.style.gap = "4px";
	link.style.alignItems = "center";
	link.href = href;
	link.target = "_blank";
	link.append(iconFromString(iconOpenInNew), Span(text));
	link.style.cursor = "pointer";
	link.style.color = "var(--bob-color-primary)";
	return link;
}
