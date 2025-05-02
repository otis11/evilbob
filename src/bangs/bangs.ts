// TODO support bangs separately from plugins i think. Maybe bangs can be a plugin view?
// https://duckduckgo.com/bang.js
// dont support all, but use the same structure to maybe support all in the future

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
	const searchWithoutBang = search.replace(bang.t, "");
	return bang.u.replace("{{{s}}}", encodeURI(searchWithoutBang));
}
