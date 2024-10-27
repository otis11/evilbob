import { iconFromString, iconFromUrl, iconPuzzleOutline } from "../../icons";
import { t } from "../../locale";
import { ResultGroup } from "../result-group";
import { Info } from "../result/info";
import { Result } from "../result/result";
import type { Tag } from "../tags/tags";

export class Management extends ResultGroup {
	permissions = ["management"];
	public id(): string {
		return "management";
	}
	prefix = "e";
	public description(): string {
		return t("Management.description");
	}

	public name(): string {
		return t("Management");
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
				? { text: t("Enabled"), type: "success" }
				: { text: t("Disabled"), type: "error" },
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
	public id(): string {
		return "extension-options";
	}
	constructor(private extension: chrome.management.ExtensionInfo) {
		super();
	}

	public name(): string {
		return "Extension Options";
	}

	public async getResults(): Promise<Result[]> {
		const results = [
			new Info({
				title: t("Version"),
				description: this.extension.version,
			}),
			new Info({ title: t("Id"), description: this.extension.id }),
			new Info({
				title: t("Short name"),
				description: this.extension.shortName,
			}),
			new Info({
				title: t("OfflineEnabled"),
				description: t("OfflineEnabled.description"),
				tags: [
					this.extension.offlineEnabled
						? { text: t("Yes"), type: "success" }
						: { text: t("No"), type: "error" },
				],
			}),
			new Info({
				title: t("MayDisable"),
				description: t("MayDisable.description"),
				tags: [
					this.extension.mayDisable
						? { text: t("Yes"), type: "success" }
						: { text: t("No"), type: "error" },
				],
			}),
		];
		if (this.extension.hostPermissions) {
			results.push(
				new Info({
					title: t("Host Permissions"),
					description: t("HostPermissions.description"),
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
					title: t("Permissions"),
					description: t("Permissions.description"),
					tags: this.extension.permissions.map((perm) => ({
						text: perm,
					})),
				}),
			);
		}
		return results;
	}
}
