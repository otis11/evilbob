import { iconFromString, iconFromUrl, iconPuzzleOutline } from "../../icons";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { ResultInfo } from "../result/result-info";
import type { Tag } from "../tags/tags";

export class ResultGroupManagement extends ResultGroup {
	permissions = ["management"];
	prefix = "e";
	description = "Search & interact with installed extensions.";

	public async getResults(): Promise<Result[]> {
		const extensions = await chrome.management.getAll();
		return extensions.map((extension) => {
			return new ResultExtension(extension);
		});
	}
}

export class ResultExtension extends Result {
	constructor(private extension: chrome.management.ExtensionInfo) {
		const iconUrl = extension.icons
			? extension.icons[1]
				? extension.icons[1].url
				: extension.icons[0].url
			: "";
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
			tags,
			options: new ResultGroupExtensionOptions(extension),
		});
	}

	async execute(): Promise<void> {
		this.emitShowOptionsEvent();
	}

	public id(): string {
		return this.name() + this.extension.id;
	}
}

export class ResultGroupExtensionOptions extends ResultGroup {
	constructor(private extension: chrome.management.ExtensionInfo) {
		super();
	}

	public async getResults(): Promise<Result[]> {
		const results = [
			new ResultInfo("Version", this.extension.version),
			new ResultInfo("Id", this.extension.id),
			new ResultInfo("Short name", this.extension.shortName),
			new ResultInfo("Offline enabled", "Is offline enabled?", [
				this.extension.offlineEnabled
					? { text: "yes", type: "success" }
					: { text: "no", type: "error" },
			]),
			new ResultInfo("May disable", "Can be disabled by the user?", [
				this.extension.mayDisable
					? { text: "yes", type: "success" }
					: { text: "no", type: "error" },
			]),
		];
		if (this.extension.hostPermissions) {
			results.push(
				new ResultInfo(
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
				new ResultInfo(
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
