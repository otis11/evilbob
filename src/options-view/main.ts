import { getSearchGroups } from "../search/search-result-groups";

const searchPermissions = document.getElementById("search-permissions");

async function renderSearchPermissions() {
	for (const group of getSearchGroups()) {
		const hasPermission = await group.hasPermission();

		const container = document.createElement("div");

		const el = document.createElement("div");
		el.innerText = group.name;

		const togglePermission = document.createElement("button");
		togglePermission.innerText = hasPermission ? "Disable" : "Enable";
		if (hasPermission) {
			togglePermission.setAttribute("data-enabled", "");
		}
		togglePermission.addEventListener("click", () => {
			if (togglePermission.hasAttribute("data-enabled")) {
				chrome.permissions.remove(
					{
						permissions: group.permissions,
						origins: group.hostPermissions,
					},
					(removed) => {
						if (removed) {
							togglePermission.removeAttribute("data-enabled");
							togglePermission.innerText = "Enable";
						} else {
							console.log("cannot remove?", removed);
						}
					},
				);
			} else {
				chrome.permissions.request(
					{
						permissions: group.permissions,
						origins: group.hostPermissions,
					},
					(granted) => {
						if (granted) {
							togglePermission.setAttribute("data-enabled", "");
							togglePermission.innerText = "Disable";
						} else {
							console.log("cannot acesss?", granted);
						}
					},
				);
			}
		});

		container.append(el, togglePermission);
		searchPermissions?.append(container);
	}
}

renderSearchPermissions();
