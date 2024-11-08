import { defineBobPlugin } from "../../core/BobPlugin.ts";
import type { Result } from "../../core/components/result/result.ts";
import { NewResult } from "../../core/components/result/simpe-result.ts";
import type { Tag } from "../../core/components/tags/tags.ts";
import { iconCookie, iconFromString } from "../../core/icons.ts";
import { getLastActiveTab } from "../../core/util/last-active-tab.ts";
import { getDomainWithoutSubdomains } from "../../core/util/url.ts";

export default defineBobPlugin({
	name: () => "Tab Cookies",
	permissions: ["tabs", "cookies"],
	hostPermissions: ["https://*/*", "http://*/*"],
	prefix: "tc",
	async provideResults(): Promise<Result[]> {
		const tab = await getLastActiveTab();
		if (!tab?.url) {
			return [
				NewResult({
					title: "No tab cookies found.",
					prepend: iconFromString(iconCookie),
				}),
			];
		}
		const domain = getDomainWithoutSubdomains(tab.url);
		const cookies = await chrome.cookies.getAll({ domain });
		console.log(cookies, domain);
		const cookieResults = cookies.map((cookie) => {
			const tags: Tag[] = [{ text: cookie.domain }];
			if (cookie.httpOnly) {
				tags.push({ text: "httpOnly", type: "success" });
			}
			if (cookie.secure) {
				tags.push({ text: "secure", type: "success" });
			}
			return NewResult({
				title: cookie.name,
				description: cookie.value,
				prepend: iconFromString(iconCookie),
				tags,
				run: async () => {
					// TODO toast or notification copied
					await navigator.clipboard.writeText(cookie.value);
				},
			});
		});
		if (cookieResults.length === 0) {
			return [
				NewResult({
					title: "No tab cookies found.",
					prepend: iconFromString(iconCookie),
				}),
			];
		}
		return cookieResults;
	},
});
