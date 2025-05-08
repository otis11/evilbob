import { browserApi } from "@/browser-api.ts";

export async function Command() {
	await browserApi.downloads.showDefaultFolder();
}
