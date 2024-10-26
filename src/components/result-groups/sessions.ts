import { isChromium } from "../../platform";
import { unixTimeToHumanReadable } from "../../util/time";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Tag } from "../tags/tags";

export class ResultGroupSessions extends ResultGroup {
	permissions = ["sessions"];
	public prefix?: string | undefined = "s";
	description = "List your recently closed sessions.";

	public async getResults(): Promise<Result[]> {
		const sessions = await chrome.sessions.getRecentlyClosed();
		return sessions.map((session) => new ResultSession(session));
	}
}

export class ResultSession extends Result {
	constructor(private session: chrome.sessions.Session) {
		const tags: Tag[] = [];
		if (session.tab) {
			tags.push({ text: "1 tab" });
		}
		if (session.window) {
			tags.push({ text: `${session.window.tabs?.length || 0} tabs` });
		}
		let timeInMs = session.lastModified;
		if (isChromium) {
			// Chromes session lastModified is for some reason in seconds since epoch. Can be removed when this will be fixed.
			// https://groups.google.com/a/chromium.org/g/chromium-extensions/c/DRAM49zGIfo
			timeInMs *= 1000;
		}
		super({
			// session.lastModified seems to be seconds since epoch and not ms since epoch in chrome? in firefox its correct
			title: `Closed ${unixTimeToHumanReadable(timeInMs)}`,
			tags,
			description: "",
		});
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
