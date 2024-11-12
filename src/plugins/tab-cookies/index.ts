import { defineBobPlugin } from "../../core/BobPlugin.ts";
import type { Result } from "../../core/components/result/result.ts";
import { NewResult } from "../../core/components/result/simpe-result.ts";
import type { Tag } from "../../core/components/tags/tags.ts";
import { iconCookie, iconFromString } from "../../core/icons.ts";
import { getLastActiveTab } from "../../core/util/last-active-tab.ts";
import { focusLastActiveWindow } from "../../core/util/last-active-window.ts";
import { getDomainWithoutSubdomains } from "../../core/util/url.ts";

export default defineBobPlugin({
	name: () => "Tab Cookies",
	permissions: ["tabs", "cookies"],
	hostPermissions: ["https://*/*", "http://*/*"],
	prefix: "tc",
	async provideResults(): Promise<Result[]> {
		const tab = await getLastActiveTab();
		let tabDomain = tab?.url ? getDomainWithoutSubdomains(tab.url) : "";
		const results: Result[] = [
			NewResult({
				title: "Clear Cookies for Base Domain",
				tags: [{ text: tabDomain }],
				run: async () => {
					const tab = await getLastActiveTab();
					if (!tab?.url || !tab.id) {
						return;
					}
					tabDomain = getDomainWithoutSubdomains(tab.url);
					const cookies = await chrome.cookies.getAll({
						domain: tabDomain,
					});
					const promises = [];
					for (const cookie of cookies) {
						const protocol = cookie.secure ? "https://" : "http://";
						const url = protocol + cookie.domain + cookie.path;
						promises.push(
							chrome.cookies.remove({
								name: cookie.name,
								url,
							}),
						);
					}
					await Promise.all(promises);
					await focusLastActiveWindow();
					await chrome.tabs.reload(tab.id, { bypassCache: true });
				},
			}),
		];
		if (!tab?.url) {
			return results;
		}
		const cookies = await chrome.cookies.getAll({ domain: tabDomain });
		for (const cookie of cookies) {
			const tags: Tag[] = [{ text: cookie.domain }];
			if (cookie.httpOnly) {
				tags.push({ text: "httpOnly", type: "success" });
			}
			if (cookie.secure) {
				tags.push({ text: "secure", type: "success" });
			}
			results.push(
				NewResult({
					title: cookie.name,
					description: cookie.value,
					prepend: iconFromString(iconCookie),
					tags,
					run: async () => {
						// TODO toast or notification copied
						await navigator.clipboard.writeText(cookie.value);
					},
				}),
			);
		}
		return results;
	},
});
