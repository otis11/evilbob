import {
	Themes,
	getCurrentDimensions,
	setCurrentDimensions,
	setCurrentTheme,
} from "../themes";
import "../themes";
import "../global.css";
import "./main.css";
import { getSearchGroups } from "../search/search-result-groups";
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

function renderSearchGroups() {
	const searchPermissions = document.createElement("div");

	for (const group of getSearchGroups()) {
		const container = document.createElement("div");
		container.append(
			new PermissionsCheckbox({
				origins: group.hostPermissions,
				permissions: group.permissions,
				title: group.name,
			}).el,
		);
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

	const labelWidth = document.createElement("label");
	labelWidth.innerText = "width";
	const inputWidth = document.createElement("input");
	inputWidth.type = "number";
	inputWidth.value = dimensions.width.toString();
	labelWidth.append(inputWidth);

	const labelHeight = document.createElement("label");
	labelHeight.innerText = "height";
	const inputHeight = document.createElement("input");
	inputHeight.type = "number";
	inputHeight.value = dimensions.height.toString();
	labelHeight.append(inputHeight);

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

renderHeader();
renderBobDimensions();
renderThemes();
renderSearchGroups();
