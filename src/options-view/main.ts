import { getSearchGroups } from "../search/search-result-groups";
import { Themes, setCurrentTheme } from "../themes";
import "../themes";
import "../global.css";
import "./main.css";

async function renderSearchPermissions() {
	const searchPermissions = document.createElement("div");

	for (const group of getSearchGroups()) {
		const hasPermission = await group.hasPermission();

		const container = document.createElement("div");

		const label = document.createElement("label");
		label.innerText = group.name;

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = hasPermission;

		label.append(checkbox);

		checkbox.addEventListener("change", () => {
			if (checkbox.checked) {
				chrome.permissions.request(
					{
						permissions: group.permissions,
						origins: group.hostPermissions,
					},
					(granted) => {
						if (granted) {
							checkbox.checked = true;
						} else {
							console.log("cannot acesss?", granted);
						}
					},
				);
			} else {
				chrome.permissions.remove(
					{
						permissions: group.permissions,
						origins: group.hostPermissions,
					},
					(removed) => {
						if (removed) {
							checkbox.checked = false;
						} else {
							console.log("cannot remove?", removed);
						}
					},
				);
			}
		});

		container.append(label);
		searchPermissions.append(container);
	}
	document.body.append(searchPermissions);
}

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

function renderThemesPermissions() {
	const label = document.createElement("label");
	label.innerText = "storage";

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	chrome.permissions.contains(
		{
			permissions: ["storage"],
		},
		(result) => {
			checkbox.checked = !!result;
		},
	);
	checkbox.addEventListener("change", () => {
		if (checkbox.checked) {
			chrome.permissions.request(
				{
					permissions: ["storage"],
				},
				(granted) => {
					if (granted) {
						checkbox.checked = true;
					} else {
						console.log("cannot acesss?", granted);
					}
				},
			);
		} else {
			chrome.permissions.remove(
				{
					permissions: ["storage"],
				},
				(removed) => {
					if (removed) {
						checkbox.checked = false;
					} else {
						console.log("cannot remove?", removed);
					}
				},
			);
		}
	});
	label.append(checkbox);
	document.body.append(label);
}

renderThemes();
renderThemesPermissions();
renderSearchPermissions();
