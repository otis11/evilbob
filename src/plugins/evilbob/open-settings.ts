import { browserApi } from "@/lib/browser-api";

export async function Command() {
	await browserApi.runtime.openOptionsPage();
}
