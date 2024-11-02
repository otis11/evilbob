export function wordSplitMatch(
	query: string,
	queryLower: string,
	target: string,
	targetLower: string,
) {
	// const words = query.split(' ')
	const wordsLower = queryLower.split(" ");
	const matches: boolean[] = [];
	let score = 0;

	for (let i = 0; i < wordsLower.length; i++) {
		let wordCharIndex = 0;
		for (
			let targetIndex = 0;
			targetIndex < targetLower.length;
			targetIndex++
		) {
			// same letter
			if (wordsLower[i][wordCharIndex] === targetLower[targetIndex]) {
				wordCharIndex += 1;
			} else {
				// reset, not same char
				wordCharIndex = 0;
			}
			// word matches
			if (wordCharIndex === wordsLower[i].length) {
				score += wordsLower[i].length;
				let moveBackwards = wordsLower[i].length - 1;
				while (moveBackwards >= 0) {
					matches[targetIndex - moveBackwards] = true;
					moveBackwards -= 1;
				}
				break;
			}
		}
	}
	return {
		matches,
		score,
	};
}
