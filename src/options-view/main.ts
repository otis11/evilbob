import {
	Themes,
	getCurrentDimensions,
	setCurrentDimensions,
	setCurrentTheme,
} from "../themes";
import "../themes";
import "../global.css";
import "./main.css";
import {
	getAlphabeticallyOrderedSearchGroups,
	getSearchGroupOrder,
	setSearchGroupOrder,
} from "../search/search-result-groups";
import { PermissionsCheckbox } from "./permissions-checkbox";

function renderThemes() {
	const themesContainer = document.createElement("div");
	themesContainer.classList.add("theme-container");

	for (const theme of Themes) {
		const div = document.createElement("div");
		div.setAttribute("data-theme", theme);
		div.classList.add("theme-card");
		div.addEventListener("click", () => {
			setCurrentTheme(theme);
		});

		const base = document.createElement("div");
		base.classList.add("theme-card-base");
		base.innerText = theme;

		const primary = document.createElement("div");
		primary.classList.add("theme-card-primary");

		const accent = document.createElement("div");
		accent.classList.add("theme-card-accent");

		div.append(base, primary, accent);
		themesContainer?.append(div);
	}
	document.body.append(themesContainer);
}

async function renderSearchGroups() {
	const searchPermissions = document.createElement("div");
	const order = await getSearchGroupOrder();

	for (const group of await getAlphabeticallyOrderedSearchGroups()) {
		const container = document.createElement("div");
		container.append(
			new PermissionsCheckbox({
				origins: group.hostPermissions,
				permissions: group.permissions,
				title: group.name,
			}).el,
		);
		const [label, input] = numberInput({
			text: "order",
			value: order[group.name]?.toString(),
		});
		input.addEventListener("input", async () => {
			const newOrder = await getSearchGroupOrder();
			newOrder[group.name] = Number.parseInt(input.value);
			setSearchGroupOrder(newOrder);
		});
		container.append(label);
		searchPermissions.append(container);
	}
	document.body.append(searchPermissions);
}

function renderHeader() {
	const header = document.createElement("header");

	const shortcutText = document.createElement("p");
	const shortcutLink = "chrome://extensions/shortcuts";
	shortcutText.innerHTML = `Go to <code>${shortcutLink}</code> to set the shortcut to open bob.`;
	header.appendChild(shortcutText);
	document.body.append(header);
}

async function renderBobDimensions() {
	const dimensions = await getCurrentDimensions();
	const container = document.createElement("div");

	const [labelWidth, inputWidth] = numberInput({
		text: "width",
		value: dimensions.width.toString(),
	});
	const [labelHeight, inputHeight] = numberInput({
		text: "height",
		value: dimensions.height.toString(),
	});

	inputWidth.addEventListener("input", () => {
		setCurrentDimensions({
			width: Number.parseInt(inputWidth.value),
			height: Number.parseInt(inputHeight.value),
		});
	});

	inputHeight.addEventListener("input", () => {
		setCurrentDimensions({
			width: Number.parseInt(inputWidth.value),
			height: Number.parseInt(inputHeight.value),
		});
	});

	container.append(labelWidth, labelHeight);
	document.body.append(container);
}

function numberInput(config: { text: string; value: string }): [
	HTMLLabelElement,
	HTMLInputElement,
] {
	const label = document.createElement("label");
	label.innerText = config.text;
	const input = document.createElement("input");
	input.type = "number";
	input.value = config.value;
	label.append(input);
	return [label, input];
}

renderHeader();
renderBobDimensions();
renderThemes();
renderSearchGroups();
