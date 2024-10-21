import { browserName, isChromium } from "../../platform";
import { SearchGroupBob } from "./bob";
import { SearchGroupBookmarks } from "./bookmarks";
import { SearchGroupCommands } from "./commands";
import { SearchGroupContentSettings } from "./content-settings";
import { SearchGroupFilter } from "./filter";
import { SearchGroupGoogle } from "./google";
import { SearchGroupHistory } from "./history";
import { SearchGroupManagement } from "./management";
import { SearchGroupSessionDevices } from "./sessions.devices";
import { SearchGroupShortcuts } from "./shortcuts";
import { SearchGroupSystemCpu } from "./system-cpu";
import { SearchGroupSystemMemory } from "./system-memory";
import { SearchGroupSystemStorage } from "./system-storage";
import { SearchGroupTabs } from "./tabs";
import { SearchGroupTopSites } from "./top-sites";
import { SearchGroupUserScripts } from "./user-scripts";

export const SEARCH_GROUPS = [
	new SearchGroupBookmarks(),
	new SearchGroupShortcuts(),
	new SearchGroupBob(),
	new SearchGroupHistory(),
	new SearchGroupTabs(),
	new SearchGroupGoogle(),
	new SearchGroupFilter(),
	new SearchGroupUserScripts(),
	new SearchGroupManagement(),
	new SearchGroupSessionDevices(),
	new SearchGroupSystemCpu(),
	new SearchGroupSystemMemory(),
	new SearchGroupSystemStorage(),
	new SearchGroupContentSettings(),
	new SearchGroupTopSites(),
	new SearchGroupCommands(),
];

export const SEARCH_GROUPS_DEFAULT_CONFIG: Record<string, SearchGroupStorage> =
	{
		bob: {
			enabled: true,
			order: 2,
		},
		history: {
			enabled: false,
			order: 4,
		},
		"content-settings": {
			enabled: false,
			order: 13,
		},
		"system.cpu": {
			enabled: false,
			order: 11,
		},
		"system.memory": {
			enabled: false,
			order: 10,
		},
		"system.storage": {
			enabled: false,
			order: 9,
		},
		bookmarks: {
			enabled: false,
			order: 3,
		},
		shortcuts: {
			order: 8,
			enabled: false,
		},
		tabs: {
			order: 1,
			enabled: false,
		},
		google: {
			order: 12,
			enabled: true,
		},
		filter: {
			order: 0,
			enabled: true,
		},
		"user-scripts": {
			order: 5,
			enabled: false,
		},
		management: {
			order: 7,
			enabled: false,
		},
		"sessions.devices": {
			order: 6,
			enabled: false,
		},
	};

export type SearchGroupStorage = {
	enabled?: boolean;
	order?: number;
};

export const SEARCH_GROUPS_USER_AGENT_FILTERED = () => {
	return SEARCH_GROUPS.filter((group) => {
		return group.supportedBrowser.includes(browserName);
	});
};
