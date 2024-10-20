import { iconBob, iconFromString } from "../../icons";
import { setThemeToDefaults } from "../../theme";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";
import { SearchGroups } from "./search-groups";

export class SearchGroupBob extends SearchGroup {
	constructor() {
		super({
			name: "bob",
			permissions: [],
			description:
				"Internal Bob commands like open settings, reset settings ...",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		return [
			new SearchResultBobOpenSettings(),
			new SearchResultBobResetSettings(),
		];
	}
}

export class SearchResultBobOpenSettings extends SearchResult {
	constructor() {
		super({
			title: "Bob Options",
			searchText: "bob settings options change",
			description: "Change me here!",
			prepend: iconFromString(iconBob),
		});
	}
	onSelect(): void {
		chrome.runtime.openOptionsPage();
		window.close();
	}
}

export class SearchResultBobResetSettings extends SearchResult {
	constructor() {
		super({
			title: "Bob Reset Settings",
			searchText: "bob settings options reset",
			description: "Reset my settings to default",
			prepend: iconFromString(iconBob),
		});
	}
	async onSelect(): Promise<void> {
		await setThemeToDefaults();
		await SearchGroups.setConfigToDefaults();
		window.close();
	}
}
