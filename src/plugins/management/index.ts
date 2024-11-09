import { defineBobPlugin } from "../../core/BobPlugin";
import { Info } from "../../core/components/result/info";
import { Result } from "../../core/components/result/result";
import { NewResult } from "../../core/components/result/simpe-result.ts";
import type { Tag } from "../../core/components/tags/tags";
import {
	iconFromString,
	iconFromUrl,
	iconPuzzleOutline,
} from "../../core/icons";
import { type Locale, coreI18n } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import { closeResultOptions } from "../../core/views/search/result-options.ts";
import { filterResults } from "../../core/views/search/results.ts";
import { loadFreshData } from "../../core/views/search/search-data.ts";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});
export default defineBobPlugin({
	icon: iconPuzzleOutline,
	permissions: ["management"],
	prefix: "e",
	description() {
		return t("Management.description");
	},
	onLocalChange(locale: Locale) {
		setLocale(locale);
	},
	name() {
		return t("Management");
	},

	async provideResults(): Promise<Result[]> {
		const extensions = await chrome.management.getAll();
		return extensions.map((extension) => {
			return new Extension(extension);
		});
	},
});

export class Extension extends Result {
	tags(): Tag[] {
		return [
			{ html: iconFromString(iconPuzzleOutline, "12px").outerHTML },
			this.extension.enabled
				? { text: coreI18n.t("Enabled"), type: "success" }
				: { text: coreI18n.t("Disabled"), type: "error" },
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
	options() {
		const results = [
			new Info({
				title: t("Version"),
				description: this.extension.version,
			}),
			new Info({
				title: coreI18n.t("Id"),
				description: this.extension.id,
			}),
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
			NewResult({
				title: "Remove/Uninstall Extension",
				run: async () => {
					await chrome.management.uninstall(this.extension.id);
					await closeResultOptions();
					await loadFreshData();
					await filterResults();
				},
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
		// types say can be undefined but in firefox there is a default extension with doesn't have this defined.
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
	constructor(private extension: chrome.management.ExtensionInfo) {
		super();
	}

	async run(): Promise<void> {
		this.emitShowOptionsEvent();
	}

	public id(): string {
		return this.className() + this.extension.id;
	}
}
