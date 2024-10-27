import { getConfig, updateConfig } from "../../config";
import { browserName } from "../../platform";
import type { ResultGroup } from "../result-group";
import { Bob } from "./bob";
import { Bookmarks } from "./bookmarks";
import { ChatGPT } from "./chatgpt";
import { Commands } from "./commands";
import { ContentSettings } from "./content-settings";
import { Downloads } from "./downloads";
import { Google } from "./google";
import { GoogleNew } from "./google-new";
import { History } from "./history";
import { Management } from "./management";
import { Prefixes } from "./prefixes";
import { Sessions } from "./sessions";
import { SessionDevices } from "./sessions-devices";
import { Shortcuts } from "./shortcuts";
import { SystemCpu } from "./system-cpu";
import { SystemMemory } from "./system-memory";
import { SystemStorage } from "./system-storage";
import { TabActions } from "./tab-actions";
import { TabGroupActions } from "./tab-and-group-actions";
import { TabGroups } from "./tab-groups";
import { Tabs } from "./tabs";
import { TopSites } from "./top-sites";
import { Window } from "./window";

export const RESULT_GROUPS = [
	new Bookmarks(),
	new Shortcuts(),
	new Bob(),
	new History(),
	new Tabs(),
	new Google(),
	new Prefixes(),
	new Management(),
	new SessionDevices(),
	new SystemCpu(),
	new SystemMemory(),
	new SystemStorage(),
	new ContentSettings(),
	new TopSites(),
	new Commands(),
	new TabActions(),
	new Window(),
	new ChatGPT(),
	new Downloads(),
	new GoogleNew(),
	new TabGroupActions(),
	new TabGroups(),
	new Sessions(),
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
		if (config.groups[group.id()]?.enabled) {
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
					[group.id()]: {
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
					[group.id()]: {
						enabled: false,
					},
				},
			});
		},
	);
}
