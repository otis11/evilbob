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
		group.supportedBrowser.includes(browserName);
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
		order: 20,
	},
	history: {
		enabled: false,
		order: 100,
	},
	"system.cpu": {
		enabled: false,
		order: 70,
	},
	"system.memory": {
		enabled: false,
		order: 69,
	},
	"system.storage": {
		enabled: false,
		order: 68,
	},
	bookmarks: {
		enabled: false,
		order: 50,
	},
	shortcuts: {
		order: 90,
		enabled: true,
	},
	tabs: {
		order: 30,
		enabled: false,
	},
	google: {
		order: 200,
		enabled: true,
	},
	filter: {
		order: 1,
		enabled: true,
	},
	"user-scripts": {
		order: 20,
		enabled: false,
	},
	management: {
		order: 20,
		enabled: false,
	},
	sessions: {
		order: 30,
		enabled: false,
	},
};
