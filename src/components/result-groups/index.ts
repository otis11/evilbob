import { getConfig, updateConfig } from "../../config";
import { browserName } from "../../platform";
import type { ResultGroup } from "../result-group";
import { Bob } from "./bob";
import { Bookmarks } from "./bookmarks";
import { ChatGPT } from "./chatgpt";
import { Commands } from "./commands";
import { ContentSettings } from "./content-settings";
import { Downloads } from "./downloads";
import { ResultGroupGoogle } from "./google";
import { ResultGroupGoogleNew } from "./google-new";
import { ResultGroupHistory } from "./history";
import { ResultGroupManagement } from "./management";
import { ResultGroupPrefixes } from "./prefixes";
import { ResultGroupSessions } from "./sessions";
import { ResultGroupSessionDevices } from "./sessions.devices";
import { ResultGroupShortcuts } from "./shortcuts";
import { ResultGroupSystemCpu } from "./system-cpu";
import { ResultGroupSystemMemory } from "./system-memory";
import { ResultGroupSystemStorage } from "./system-storage";
import { ResultGroupTabActions } from "./tab-actions";
import { ResultGroupTabAndGroupActions } from "./tab-and-group-actions";
import { ResultGroupTabGroups } from "./tab-groups";
import { ResultGroupTabs } from "./tabs";
import { ResultGroupTopSites } from "./top-sites";
import { ResultGroupWindow } from "./window";

export const RESULT_GROUPS = [
	new Bookmarks(),
	new ResultGroupShortcuts(),
	new Bob(),
	new ResultGroupHistory(),
	new ResultGroupTabs(),
	new ResultGroupGoogle(),
	new ResultGroupPrefixes(),
	new ResultGroupManagement(),
	new ResultGroupSessionDevices(),
	new ResultGroupSystemCpu(),
	new ResultGroupSystemMemory(),
	new ResultGroupSystemStorage(),
	new ContentSettings(),
	new ResultGroupTopSites(),
	new Commands(),
	new ResultGroupTabActions(),
	new ResultGroupWindow(),
	new ChatGPT(),
	new Downloads(),
	new ResultGroupGoogleNew(),
	new ResultGroupTabAndGroupActions(),
	new ResultGroupTabGroups(),
	new ResultGroupSessions(),
];

export const RESULT_GROUPS_BROWSER_FILTERED = (() => {
	return RESULT_GROUPS.filter((group) => {
		return group.supportedBrowsers.includes(browserName);
	});
})();

export async function getEnabledResultGroups() {
	const config = await getConfig();
	const groups = [];
	for (const group of RESULT_GROUPS_BROWSER_FILTERED) {
		if (config.groups[group.name]?.enabled) {
			groups.push(group);
		}
	}
	return groups;
}

export async function enableResultGroup(group: ResultGroup) {
	chrome.permissions.request(
		{
			permissions: group.permissions,
			origins: group.hostPermissions,
		},
		async (granted) => {
			if (!granted) {
				console.error("could not grant permission for group?", group);
			}
			await updateConfig({
				groups: {
					[group.name]: {
						enabled: true,
					},
				},
			});
		},
	);
}

export async function disableResultGroup(group: ResultGroup) {
	chrome.permissions.remove(
		{
			permissions: group.permissions,
			origins: group.hostPermissions,
		},
		async (removed) => {
			if (!removed) {
				console.error("could not remove permission for group?", group);
			}
			await updateConfig({
				groups: {
					[group.name]: {
						enabled: false,
					},
				},
			});
		},
	);
}
