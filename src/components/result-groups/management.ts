import { iconFromString, iconFromUrl, iconPuzzleOutline } from "../../icons";
import { ResultGroup } from "../result-group";
import { Info } from "../result/info";
import { Result } from "../result/result";
import type { Tag } from "../tags/tags";

export class Management extends ResultGroup {
	permissions = ["management"];
	prefix = "e";
	public description(): string {
		return "Search & interact with installed extensions.";
	}

	public name(): string {
		return "Management";
	}

	public async getResults(): Promise<Result[]> {
		const extensions = await chrome.management.getAll();
		return extensions.map((extension) => {
			return new Extension(extension);
		});
	}
}

export class Extension extends Result {
	tags(): Tag[] {
		return [
			{ html: iconFromString(iconPuzzleOutline, "12px").outerHTML },
			this.extension.enabled
				? { text: "enabled", type: "success" }
				: { text: "disabled", type: "error" },
			{ text: this.extension.installType },
			{ text: this.extension.version },
		];
	}

	public title(): string {
		return this.extension.name;
	}

	public description(): string {
		return this.extension.description;
	}

	prepend(): HTMLElement | undefined {
		const iconUrl = this.extension.icons
			? this.extension.icons[1]
				? this.extension.icons[1].url
				: this.extension.icons[0].url
			: "";
		return iconFromUrl(iconUrl);
	}
	options(): ResultGroup | undefined {
		return new ExtensionOptions(this.extension);
	}
	constructor(private extension: chrome.management.ExtensionInfo) {
		super();
	}

	async execute(): Promise<void> {
		this.emitShowOptionsEvent();
	}

	public id(): string {
		return this.name() + this.extension.id;
	}
}

export class ExtensionOptions extends ResultGroup {
	constructor(private extension: chrome.management.ExtensionInfo) {
		super();
	}

	public name(): string {
		return "Extension Options";
	}

	public async getResults(): Promise<Result[]> {
		const results = [
			new Info({ title: "Version", description: this.extension.version }),
			new Info({ title: "Id", description: this.extension.id }),
			new Info({
				title: "Short name",
				description: this.extension.shortName,
			}),
			new Info({
				title: "Offline enabled",
				description: "Is offline enabled?",
				tags: [
					this.extension.offlineEnabled
						? { text: "yes", type: "success" }
						: { text: "no", type: "error" },
				],
			}),
			new Info({
				title: "May disable",
				description: "Can be disabled by the user?",
				tags: [
					this.extension.mayDisable
						? { text: "yes", type: "success" }
						: { text: "no", type: "error" },
				],
			}),
		];
		if (this.extension.hostPermissions) {
			results.push(
				new Info({
					title: "Host Permissions",
					description:
						"Host permissions allow extensions to interact with the URL's matching patterns.",
					tags: this.extension.hostPermissions.map((perm) => ({
						text: perm,
					})),
				}),
			);
		}
		// types say can be undefined but in firefox there is a default extension with doesnt have this defined.
		if (this.extension.permissions) {
			results.push(
				new Info({
					title: "Permissions",
					description:
						"To access most extension APIs and features, you must declare permissions in your extension's manifest. Some permissions trigger warnings that users must allow to continue using the extension.",
					tags: this.extension.permissions.map((perm) => ({
						text: perm,
					})),
				}),
			);
		}
		return results;
	}
}
