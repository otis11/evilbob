import { browserApi, getCurrentTab } from "@/browser-api.ts";
import { toast } from "@/components/Toast.tsx";
import { getDomainWithoutSubdomains } from "@/lib/utils.ts";

export async function Command() {
	const currentTab = await getCurrentTab();
	if (currentTab?.url) {
		const cookies = await browserApi.cookies.getAll({
			domain: getDomainWithoutSubdomains(currentTab.url),
		});
		const promises = [];
		for (const cookie of cookies) {
			const protocol = cookie.secure ? "https://" : "http://";
			const url = protocol + cookie.domain + cookie.path;
			promises.push(
				browserApi.cookies.remove({
					name: cookie.name,
					url,
				}),
			);
		}
		await Promise.all(promises);
		toast("Removed all cookies.");
	}
}
