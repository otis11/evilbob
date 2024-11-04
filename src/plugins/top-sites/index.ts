import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import type { Tag } from "../../core/components/tags/tags";
import {
	faviconFromUrl,
	iconArrowUpBold,
	iconFromString,
} from "../../core/icons";
import type { Locale } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import { focusLastActiveWindow } from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	prefix: "top",
	permissions: ["topSites"],
	description() {
		return t("TopSites.description");
	},
	name() {
		return t("TopSites");
	},
	onLocalChange(locale: Locale) {
		setLocale(locale);
	},
	async provideResults(): Promise<Result[]> {
		return (await chrome.topSites.get()).map(
			(site) => new MostVisitedURL(site),
		);
	},
	icon: iconArrowUpBold,
});

export class MostVisitedURL extends Result {
	title(): string {
		return this.site.title;
	}
	description(): string {
		return this.site.url;
	}
	prepend(): HTMLElement | undefined {
		return faviconFromUrl(this.site.url);
	}
	tags(): Tag[] {
		return [{ html: iconFromString(iconArrowUpBold, "12px").outerHTML }];
	}
	constructor(private site: chrome.topSites.MostVisitedURL) {
		super();
	}
	public id(): string {
		return this.className() + this.site.url;
	}

	async run(): Promise<void> {
		await chrome.tabs.create({ url: this.site.url });
		await focusLastActiveWindow();
	}
}
