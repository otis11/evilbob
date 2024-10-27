import { t } from "../../locale";
import { isChromium } from "../../platform";
import { unixTimeToHumanReadable } from "../../util/time";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Tag } from "../tags/tags";

export class Sessions extends ResultGroup {
	public id(): string {
		return "sessions";
	}
	public name(): string {
		return t("Sessions");
	}
	permissions = ["sessions"];
	public prefix?: string | undefined = "s";
	public description(): string {
		return t("Sessions.description");
	}

	public async getResults(): Promise<Result[]> {
		const sessions = await chrome.sessions.getRecentlyClosed();
		return sessions.map((session) => new Session(session));
	}
}

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
