import { browserApi } from "@/lib/browser-api.ts";

export async function Command() {
	await browserApi.downloads.showDefaultFolder();
}
