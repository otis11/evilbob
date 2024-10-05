import {
	Themes,
	getCurrentDimensions,
	setCurrentDimensions,
	setCurrentTheme,
} from "../themes";
import "../themes";
import "../global.css";
import "./main.css";
import { isChromium } from "../platform";
import { SearchResultGroups } from "../search-groups";

const searchResultGroups = new SearchResultGroups();

function renderThemes() {
	const container = document.createElement("div");
	const themesContainer = document.createElement("div");
	themesContainer.classList.add("theme-container");
	container.append(groupHeading("Themes"), themesContainer);

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
	document.body.append(container);
}

function groupHeading(text: string) {
	const heading = document.createElement("h3");
	heading.innerText = text;
	return heading;
}

async function renderSearchGroups() {
	const searchGroups = document.createElement("div");

	searchGroups.append(groupHeading("Search Groups"));
	searchResultGroups.orderAlphabetically();
	const config = await SearchResultGroups.getConfig();
	for (const group of searchResultGroups.list) {
		const container = document.createElement("div");
		const checkboxLabel = document.createElement("label");
		checkboxLabel.innerText = group.name;
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = await group.isEnabled();
		checkbox.addEventListener("change", () => {
			if (checkbox.checked) {
				group.enable();
			} else {
				group.disable();
			}
		});
		checkboxLabel.append(checkbox);
		container.append(checkboxLabel);
		const [label, input] = numberInput({
			text: "order",
			value: config[group.name]?.order?.toString() || "0",
		});

		input.addEventListener("input", async () => {
			SearchResultGroups.setConfig(group.name, {
				order: Number.parseInt(input.value),
			});
		});
		container.append(label);
		searchGroups.append(container);
	}
	document.body.append(searchGroups);
}

function renderHeader() {
	const header = document.createElement("header");

	const shortcutText = document.createElement("p");
	const shortcutLink = isChromium
		? "chrome://extensions/shortcuts"
		: "about:addons";
	const specificNotice = isChromium
		? "Setting it to <strong>Global</strong> you can open bob from outside your browser."
		: 'Click the settings icon in the right corner. Choose "Manage Extension Shortcuts"';
	shortcutText.innerHTML = `Go to <strong>${shortcutLink}</strong> to set the shortcut to open bob. ${specificNotice}`;
	header.appendChild(shortcutText);
	document.body.append(header);
}

async function renderBobDimensions() {
	const dimensions = await getCurrentDimensions();
	const container = document.createElement("div");
	container.append(groupHeading("Window Dimensions"));

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
