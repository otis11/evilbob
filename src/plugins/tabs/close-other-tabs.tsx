import { getCurrentTab } from "@/lib/browser-api.ts";
import { closeOtherTabs } from "@/plugins/tabs/utils.ts";

export async function Command() {
	const lastActiveTab = await getCurrentTab();
	if (!lastActiveTab) {
		return;
	}
	await closeOtherTabs(lastActiveTab);
}
