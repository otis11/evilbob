// sort bangs by length, so first shown is always the shortest.
// sorted in this script to reduce overhead when rendering
import path from "node:path";
import type { Bang } from "@/lib/bangs/bangs.ts";

const bangsFile = Bun.file(
	path.resolve(__dirname, "../src/lib/bangs/bangs.json"),
);

const bangs: LocalBang[] = await bangsFile.json();

type LocalBang = {
	c: string;
	d: string;
	r: number;
	s: string;
	sc: string;
	t: string;
	u: string;
};
// "c":"News" -> Category
// "d":"astronet.ge", -> Domain
// "r":0,
// "s":"Astronet.Ge", -> Title?
// "sc":"Online",
// "t":"\u10d0\u10e1\u10e2\u10e0\u10dd", -> BANG without !
// "u":"http://astronet.ge/?s={{{s}}}" -> Url

const bangsSorted: Bang[] = bangs
	.map((b) => ({ s: b.s, t: b.t, u: b.u }))
	.sort((a, b) => {
		if (a.t.length > b.t.length) {
			return 1;
		}
		if (a.t.length < b.t.length) {
			return -1;
		}
		return 0;
	});

await Bun.write(
	path.resolve(__dirname, "../src/lib/bangs/bangs-sorted.json"),
	JSON.stringify(bangsSorted),
);
