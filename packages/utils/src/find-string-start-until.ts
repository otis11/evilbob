export function findStringStartUntil(
	haystack: string,
	start: string,
	until: string,
): [boolean, string] {
	let valueFound = "";
	let isFound = false;
	for (let i = 0; i < haystack.length; i++) {
		if (haystack[i] === start) {
			isFound = true;
			continue;
		}
		if (isFound && haystack[i] === until) {
			break;
		}
		if (isFound) {
			valueFound += haystack[i];
		}
	}
	return [isFound, valueFound];
}
