import { browserName, isChromium } from "../../platform";
import { SearchGroupBob } from "./bob";
import { SearchGroupBookmarks } from "./bookmarks";
import { SearchGroupFilter } from "./filter";
import { SearchGroupGoogle } from "./google";
import { SearchGroupHistory } from "./history";
import { SearchGroupManagement } from "./management";
import { SearchGroupSessions } from "./sessions";
import { SearchGroupShortcuts } from "./shortcuts";
import { SearchGroupSystemCpu } from "./system-cpu";
import { SearchGroupSystemMemory } from "./system-memory";
import { SearchGroupSystemStorage } from "./system-storage";
import { SearchGroupTabs } from "./tabs";
import { SearchGroupUserScripts } from "./user-scripts";

export type SearchGroupName =
	| "bookmarks"
	| "history"
	| "system.cpu"
	| "system.memory"
	| "system.storage"
	| "shortcuts"
	| "bob"
	| "google"
	| "filter"
	| "user-scripts"
	| "management"
	| "sessions"
	| "tabs";

export type SearchGroupStorage = {
	enabled?: boolean;
	order?: number;
};

export const SEARCH_GROUPS_USER_AGENT_FILTERED = () => {
	return SEARCH_GROUPS.filter((group) => {
		return group.supportedBrowser.includes(browserName);
	});
};

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
	new SearchGroupSessions(),
	new SearchGroupSystemCpu(),
	new SearchGroupSystemMemory(),
	new SearchGroupSystemStorage(),
];

export const SEARCH_GROUPS_DEFAULT_CONFIG: Record<
	SearchGroupName,
	SearchGroupStorage
> = {
	bob: {
		enabled: true,
		order: 2,
	},
	history: {
		enabled: false,
		order: 4,
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
		enabled: true,
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
	sessions: {
		order: 6,
		enabled: false,
	},
};
