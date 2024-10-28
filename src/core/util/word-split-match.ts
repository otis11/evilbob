// function fuzzyMatch(query: string, target: string) {
// 	// TODO very slow
// 	const queryLower = query.toLowerCase();
// 	const targetLower = target.toLowerCase();
// 	const scoreMatrix: number[][] = [];
// 	for (let queryIndex = 0; queryIndex < query.length; queryIndex++) {
// 		scoreMatrix[queryIndex] = [];
// 		const queryPrevIndex = queryIndex - 1;

// 		for (let targetIndex = 0; targetIndex < target.length; targetIndex++) {
// 			const targetPrevIndex = targetIndex - 1;
// 			// same char & same case
// 			if (query[queryIndex] === target[targetIndex]) {
// 				scoreMatrix[queryIndex][targetIndex] = 2;
// 			}
// 			// same char
// 			else if (queryLower[queryIndex] === targetLower[targetIndex]) {
// 				scoreMatrix[queryIndex][targetIndex] = 1;
// 			}

// 			// bonus if first char matches
// 			if (
// 				queryIndex === 0 &&
// 				targetIndex === 0 &&
// 				scoreMatrix[queryIndex][targetIndex] > 0
// 			) {
// 				scoreMatrix[queryIndex][targetIndex] = 4;
// 			}

// 			if (queryPrevIndex > -1 && targetPrevIndex > -1) {
// 				if (
// 					scoreMatrix[queryPrevIndex][targetPrevIndex] > 0 &&
// 					scoreMatrix[queryIndex][targetIndex] > 0
// 				) {
// 					scoreMatrix[queryIndex][targetIndex] += 10;

// 					let backTrackQuery = queryPrevIndex;
// 					let backTrackTarget = targetPrevIndex;
// 					do {
// 						scoreMatrix[backTrackQuery][backTrackTarget] += 10;
// 						backTrackQuery -= 1;
// 						backTrackTarget -= 1;
// 					} while (
// 						scoreMatrix[backTrackQuery] &&
// 						scoreMatrix[backTrackQuery][backTrackTarget] > 10
// 					);
// 				}
// 			}
// 		}
// 	}

// 	const matches = [];
// 	let score = 0;
// 	for (let queryIndex = 0; queryIndex < scoreMatrix.length; queryIndex++) {
// 		let bestCharScore = 0;
// 		let bestCharIndex = 0;
// 		for (
// 			let targetIndex = 0;
// 			targetIndex < scoreMatrix[queryIndex].length;
// 			targetIndex++
// 		) {
// 			if (scoreMatrix[queryIndex][targetIndex] > bestCharScore) {
// 				bestCharScore = scoreMatrix[queryIndex][targetIndex];
// 				bestCharIndex = targetIndex;
// 			}
// 		}
// 		if (bestCharScore > 0) {
// 			matches[bestCharIndex] = true;
// 			score += bestCharScore;
// 		}
// 	}

// 	return {
// 		score,
// 		matches,
// 	};
// }

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
