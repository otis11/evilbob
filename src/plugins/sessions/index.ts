import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import type { Tag } from "../../core/components/tags/tags";
import type { Locale } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import { isChromium } from "../../core/platform";
import { unixTimeToHumanReadable } from "../../core/util/time";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});
export default defineBobPlugin({
	name() {
		return t("Sessions");
	},
	permissions: ["sessions"],
	prefix: "s",
	description() {
		return t("Sessions.description");
	},
	onLocalChange(locale: Locale) {
		setLocale(locale);
	},
	async provideResults(): Promise<Result[]> {
		const sessions = await chrome.sessions.getRecentlyClosed();
		return sessions.map((session) => new Session(session));
	},
});

export class Session extends Result {
	tags(): Tag[] {
		const tags: Tag[] = [];
		if (this.session.tab) {
			tags.push({ text: t("1 tab") });
		}
		if (this.session.window) {
			tags.push({
				text: t("TabsCount", {
					count: this.session.window.tabs?.length || 0,
				}),
			});
		}
		return tags;
	}

	title(): string {
		let timeInMs = this.session.lastModified;
		if (isChromium) {
			// Chromes session lastModified is for some reason in seconds since epoch. Can be removed when this will be fixed.
			// https://groups.google.com/a/chromium.org/g/chromium-extensions/c/DRAM49zGIfo
			timeInMs *= 1000;
		}
		return `Closed ${unixTimeToHumanReadable(timeInMs)}`;
	}
	constructor(private session: chrome.sessions.Session) {
		super();
	}

	async execute(): Promise<void> {
		if (this.session.window?.sessionId) {
			await chrome.sessions.restore(this.session.window.sessionId);
		}
		if (this.session.tab?.sessionId) {
			await chrome.sessions.restore(this.session.tab.sessionId);
		}
	}
}
