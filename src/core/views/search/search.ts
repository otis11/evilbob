import type { Result } from "../../components/result/result";
import { Search } from "../../components/search";
import type { BobUsage } from "../../usage";

export function sortResults(
	results: Result[],
	search: Search,
	usage: BobUsage,
) {
	return results.sort((a, b) => {
		const aa = a.search(search);
		const bb = b.search(search);
		// title
		if (aa.title.score > bb.title.score) {
			return -1;
		}
		if (aa.title.score < bb.title.score) {
			return 1;
		}
		// don't sort after description, just showing the matches in description is enough. Recent results are more important
		// same title score, use description
		// if (aa.description.score > bb.description.score) {
		// 	return -1;
		// }
		// if (aa.description.score < bb.description.score) {
		// 	return 1;
		// }

		// by recent usage
		const aL = usage.results[a.id()]?.l || 0;
		const bL = usage.results[b.id()]?.l || 0;
		if (aL > bL) {
			return -1;
		}
		if (aL < bL) {
			return 1;
		}

		// by length of title, shorter should be first as they have less text to match with
		const aTL = a.title.length;
		const bTL = b.title.length;
		if (aTL > bTL) {
			return 1;
		}
		if (aTL < bTL) {
			return -1;
		}

		return 0;
	});
}

export function searchResults(
	results: Result[],
	search: Search,
	usage: BobUsage,
) {
	const filtered = results.filter((result) => {
		const r = result.search(search);
		return search.textLower.length
			? r.title.score > search.minMatchScore ||
					r.description.score > search.minMatchScore
			: true;
	});
	return sortResults(filtered, search, usage);
}

export function newSearch(input: HTMLInputElement, text?: string) {
	return new Search({
		inputElement: input,
		text: typeof text === "string" ? text : input.value || "",
		selectionStart: input.selectionStart,
	});
}
