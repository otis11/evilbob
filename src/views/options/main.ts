import { loadCustomTheme } from "../../theme";
import "../../theme";
import "../global.css";
import "./main.css";
import { FlexContainer } from "../../components/flex-container";
import { ResultGroupCard } from "../../components/result-group-card/result-group-card";
import { RESULT_GROUPS } from "../../components/result-groups";
import { ThemeCard } from "../../components/theme-card/theme-card";
import { type ResultGroupConfig, getConfig, updateConfig } from "../../config";
import { iconFromString, iconGithub, iconPencil } from "../../icons";
import { isChromium } from "../../platform";
import { Themes } from "../../theme/themes";

function renderThemes() {
	const container = document.createElement("div");
	const themesContainer = document.createElement("div");
	themesContainer.classList.add("theme-container");
	container.append(groupHeading("Themes"), themesContainer);

	for (const theme of Themes) {
		const card = ThemeCard(theme);
		if (theme === "custom") {
			const editButton = document.createElement("button");
			editButton.style.display = "flex";
			editButton.style.alignItems = "center";
			editButton.style.margin = "8px auto";
			const icon = iconFromString(iconPencil);
			icon.style.marginRight = "4px";
			const editText = document.createElement("span");
			editText.innerText = "Edit";
			editButton.append(icon, editText);
			editButton.addEventListener("click", () => {
				chrome.tabs.create({
					url: "views/custom-theme/index.html",
				});
			});
			card.append(editButton);
		}
		themesContainer.append(card);
	}
	document.body.append(container);
}

function groupHeading(text: string) {
	const heading = document.createElement("h3");
	heading.innerText = text;
	return heading;
}

async function renderResultGroups() {
	const resultGroups = document.createElement("div");

	resultGroups.append(groupHeading("Result Groups"));
	const config = await getConfig();

	const labelAllGroups = document.createElement("label");
	labelAllGroups.classList.add("result-group-title");

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked =
		RESULT_GROUPS.length ===
		RESULT_GROUPS.filter((g) => config.groups[g.name]?.enabled).length;
	checkbox.addEventListener("change", async () => {
		const groupConfig: Record<string, ResultGroupConfig> = {};
		for (const group of RESULT_GROUPS) {
			groupConfig[group.name] = {
				enabled: checkbox.checked,
			};
		}
		const permissions = RESULT_GROUPS.flatMap((g) => g.permissions);
		const hostPermissions = RESULT_GROUPS.flatMap((g) => g.hostPermissions);

		if (checkbox.checked) {
			chrome.permissions.request(
				{
					permissions: permissions,
					origins: hostPermissions,
				},
				async (granted) => {
					if (!granted) {
						console.error("could not grant permission for all?");
						return;
					}
					await updateConfig({
						groups: groupConfig,
					});
					window.location.reload();
				},
			);
		} else {
			chrome.permissions.remove(
				{
					permissions: permissions,
					origins: hostPermissions,
				},
				async (removed) => {
					if (!removed) {
						console.error("could not remove permission for all?");
						return;
					}
					await updateConfig({
						groups: groupConfig,
					});
					window.location.reload();
				},
			);
		}

		await updateConfig({
			groups: groupConfig,
		});
		window.location.reload();
	});

	const labelText = document.createElement("span");
	labelText.innerText = "All";
	labelAllGroups.append(checkbox, labelText);

	const resultGroupsContainer = document.createElement("div");
	resultGroupsContainer.classList.add("result-groups-container");
	const sortedResultGroups = RESULT_GROUPS.sort((a, b) => {
		if (a.name > b.name) {
			return 1;
		}
		if (a.name < b.name) {
			return -1;
		}
		return 0;
	});
	for (const group of sortedResultGroups) {
		resultGroupsContainer.append(ResultGroupCard(group, config));
	}
	resultGroups.append(labelAllGroups, resultGroupsContainer);
	document.body.append(resultGroups);
}

function renderHeader() {
	const header = document.createElement("header");

	const shortcutText = document.createElement("p");
	const shortcutLink = isChromium
		? "chrome://extensions/shortcuts"
		: "about:addons";
	const specificNotice = isChromium
		? "Setting it to <strong>Global</strong> makes the shortcut system wide!"
		: 'Click the settings icon in the right corner. Choose "Manage Extension Shortcuts"';
	shortcutText.innerHTML = `Hi! Go to <strong>${shortcutLink}</strong> to set a shortcut to open Bob. ${specificNotice}`;
	header.append(shortcutText);
	document.body.append(header);
}

async function renderBobDimensions() {
	const config = await getConfig();
	const container = FlexContainer({ flexDirection: "column" });
	container.append(groupHeading("Window Dimensions"));

	const [labelWidth, inputWidth] = numberInput({
		value: config.dimensions.width.toString(),
		label: "Width",
	});
	const [labelHeight, inputHeight] = numberInput({
		value: config.dimensions.height.toString(),
		label: "Height",
	});

	inputWidth.addEventListener("input", () => {
		updateConfig({
			dimensions: {
				width: Number.parseInt(inputWidth.value),
				height: Number.parseInt(inputHeight.value),
			},
		});
	});

	inputHeight.addEventListener("input", () => {
		updateConfig({
			dimensions: {
				width: Number.parseInt(inputWidth.value),
				height: Number.parseInt(inputHeight.value),
			},
		});
	});

	labelHeight.style.marginBottom = "8px";
	labelWidth.style.marginBottom = "8px";
	container.append(labelWidth, labelHeight);
	document.body.append(container);
}

function numberInput(config: { value: string; label: string }): [
	HTMLLabelElement,
	HTMLInputElement,
] {
	const label = document.createElement("label");
	const input = document.createElement("input");
	const labelText = document.createElement("span");
	labelText.innerText = config.label;
	input.type = "number";
	input.value = config.value;
	label.append(input, labelText);
	return [label, input];
}

function renderFooter() {
	const footer = document.createElement("footer");

	const githubIcon = iconFromString(iconGithub, "48px");
	const githubLink = document.createElement("a");
	githubLink.href = "https://github.com/otis11/Bob";
	githubLink.target = "_blank";
	githubLink.append(githubIcon);

	footer.append(githubLink);
	document.body.append(footer);
}

(async () => {
	renderHeader();
	await renderResultGroups();
	await renderBobDimensions();
	renderThemes();
	renderFooter();
	await loadCustomTheme();
})();
