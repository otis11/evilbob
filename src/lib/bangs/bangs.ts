// https://duckduckgo.com/bang.js
// bangs-sorted.json are generated via scripts/create-bangs-sorted.ts
export type Bang = { s: string; t: string; u: string };
let cache: Bang[] | undefined = undefined;

export async function loadBangs(): Promise<Bang[]> {
	if (cache) {
		return cache;
	}
	cache = (await import("./bangs-sorted.json")).default;
	return cache;
}

export function searchInBang(search: string, b: Bang) {
	return b.t.startsWith(search.toLowerCase());
}

export function getBangSearchUrl(search: string, bang: Bang) {
	const searchWithoutBang = search.replace(`!${bang.t}`, "").trim();
	return bang.u.replace("{{{s}}}", encodeURI(searchWithoutBang));
}
