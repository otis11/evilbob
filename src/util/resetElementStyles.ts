export type resetElementStylesConfig = {
	width?: string;
	height?: string;
};

export function resetElementStyles(
	el: HTMLElement,
	config?: resetElementStylesConfig,
) {
	el.style.minWidth = config?.width || "unset";
	el.style.minHeight = config?.height || "unset";
	el.style.maxWidth = config?.width || "unset";
	el.style.maxHeight = config?.height || "unset";
	el.style.position = "static";
	el.style.display = "block";
	el.style.margin = "0";
	el.style.padding = "0";
}
