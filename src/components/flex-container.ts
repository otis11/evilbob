export type FlexContainerConfig = {
	gap?: string;
	flexWrap?: string;
	alignItems?: string;
	flexDirection?: string;
	children?: (HTMLElement | DocumentFragment)[];
};

export function FlexContainer(config: FlexContainerConfig) {
	const container = document.createElement("div");
	container.style.display = "flex";
	if (config.gap) {
		container.style.gap = config.gap;
	}
	if (config.flexWrap) {
		container.style.flexWrap = config.flexWrap;
	}
	if (config.flexDirection) {
		container.style.flexDirection = config.flexDirection;
	}
	if (config.alignItems) {
		container.style.alignItems = config.alignItems;
	}
	if (config.children) {
		container.append(...config.children);
	}
	return container;
}
