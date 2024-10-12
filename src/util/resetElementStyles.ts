export type resetElementStylesConfig = {
	width?: string;
	height?: string;
};

export function resetElementStyles(
	el: HTMLElement,
	config?: resetElementStylesConfig,
) {
	el.style.setProperty("min-width", config?.width || "unset", "important");
	el.style.setProperty("min-height", config?.height || "unset", "important");
	el.style.setProperty("max-width", config?.width || "unset", "important");
	el.style.setProperty("max-height", config?.height || "unset", "important");
	el.style.setProperty("position", "static", "important");
	el.style.setProperty("display", "block", "important");
	el.style.setProperty("margin", "0", "important");
	el.style.setProperty("padding", "0", "important");
}
