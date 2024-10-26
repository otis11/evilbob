import { GroupHeading } from "../../components/group-heading";
import { ResultGroupCard } from "../../components/result-group-card/result-group-card";
import { RESULT_GROUPS_BROWSER_FILTERED } from "../../components/result-groups";
import {
	type BobConfig,
	type ResultGroupConfig,
	updateConfig,
} from "../../config";

export async function renderResultGroups(config: BobConfig) {
	const resultGroups = document.createElement("div");

	resultGroups.append(GroupHeading("Result Groups"));

	const labelAllGroups = document.createElement("label");
	labelAllGroups.classList.add("result-group-title");

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked =
		RESULT_GROUPS_BROWSER_FILTERED.length ===
		RESULT_GROUPS_BROWSER_FILTERED.filter(
			(g) => config.groups[g.name()]?.enabled,
		).length;
	checkbox.addEventListener("change", async () => {
		const groupConfig: Record<string, ResultGroupConfig> = {};
		for (const group of RESULT_GROUPS_BROWSER_FILTERED) {
			groupConfig[group.name()] = {
				enabled: checkbox.checked,
			};
		}
		const permissions = RESULT_GROUPS_BROWSER_FILTERED.flatMap(
			(g) => g.permissions,
		);
		const hostPermissions = RESULT_GROUPS_BROWSER_FILTERED.flatMap(
			(g) => g.hostPermissions,
		);

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
	});

	const labelText = document.createElement("span");
	labelText.innerText = "All";
	labelAllGroups.append(checkbox, labelText);

	const resultGroupsContainer = document.createElement("div");
	resultGroupsContainer.classList.add("result-groups-container");
	const sortedResultGroups = RESULT_GROUPS_BROWSER_FILTERED.sort((a, b) => {
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
