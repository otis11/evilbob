import { browserApi } from "@/lib/browser-api.ts";

export async function Command() {
	await browserApi.tabs.create({
		url: "https://sheets.new",
	});
}
