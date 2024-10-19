import { iconFromString, iconFromUrl, iconPuzzleOutline } from "../../icons";
import { SearchGroup } from "../search-group";
import { SearchResult } from "../search-result/search-result";
import { SearchResultInfo } from "../search-result/search-result-info";
import type { Tag } from "../tags/tags";

export class SearchGroupManagement extends SearchGroup {
	constructor() {
		super({
			name: "management",
			permissions: ["management"],
			filter: "!e",
			description: "Search & interact with installed extensions.",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const extensions = await chrome.management.getAll();
		return extensions.map((extension) => {
			return new SearchResultExtension(extension);
		});
	}
}

export class SearchResultExtension extends SearchResult {
	constructor(extension: chrome.management.ExtensionInfo) {
		const iconUrl = extension.icons ? extension.icons[0].url : "";
		const icon = iconFromUrl(iconUrl);
		const tags: Tag[] = [
			{ html: iconFromString(iconPuzzleOutline, "12px").outerHTML },
			extension.enabled
				? { text: "enabled", type: "success" }
				: { text: "disabled", type: "error" },
			{ text: extension.installType },
			{ text: extension.version },
		];

		super({
			title: extension.name,
			description: extension.description,
			prepend: icon,
			searchText: `${extension.name} ${extension.description}`,
			tags,
			options: new SearchGroupExtensionOptions(extension),
		});
	}

	onSelect(): void {
		this.emitShowOptionsEvent();
	}
}

export class SearchGroupExtensionOptions extends SearchGroup {
	constructor(private extension: chrome.management.ExtensionInfo) {
		super({
			description: "extension options",
			name: "extension options",
		});
	}

	public async getResults(): Promise<SearchResult[]> {
		const results = [
			new SearchResultInfo("Version", this.extension.version),
			new SearchResultInfo("Id", this.extension.id),
			new SearchResultInfo("Short name", this.extension.shortName),
			new SearchResultInfo("Offline enabled", "Is offline enabled?", [
				this.extension.offlineEnabled
					? { text: "yes", type: "success" }
					: { text: "no", type: "error" },
			]),
			new SearchResultInfo(
				"May disable",
				"Can be disabled by the user?",
				[
					this.extension.mayDisable
						? { text: "yes", type: "success" }
						: { text: "no", type: "error" },
				],
			),
		];
		if (this.extension.hostPermissions) {
			results.push(
				new SearchResultInfo(
					"Host Permissions",
					"Host permissions allow extensions to interact with the URL's matching patterns.",
					this.extension.hostPermissions.map((perm) => ({
						text: perm,
					})),
				),
			);
		}
		// types say can be undefined but in firefox there is a default extension with doesnt have this defined.
		if (this.extension.permissions) {
			results.push(
				new SearchResultInfo(
					"Permissions",
					"To access most extension APIs and features, you must declare permissions in your extension's manifest. Some permissions trigger warnings that users must allow to continue using the extension.",
					this.extension.permissions.map((perm) => ({
						text: perm,
					})),
				),
			);
		}
		return results;
	}
}
