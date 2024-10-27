export type SearchConfig = {
	text: string;
	selectionStart: number | null;
	inputElement?: HTMLInputElement;
};

export class Search {
	text: string;
	textLower: string;
	selectionStart: number | null;
	inputElement?: HTMLInputElement;
	minMatchScore: number;

	constructor(config: SearchConfig) {
		this.text = config.text;
		this.textLower = config.text.toLowerCase();
		this.selectionStart = config.selectionStart;
		this.inputElement = config.inputElement;
		this.minMatchScore = Math.floor(this.text.length / 2);
	}

	currentWord() {
		if (this.selectionStart === null) {
			return null;
		}
		const words = this.words();
		let wordsLengthGoneThrough = 0;
		for (const word of words) {
			wordsLengthGoneThrough += word.length;
			if (wordsLengthGoneThrough >= this.selectionStart) {
				return word;
			}
		}
		return words.at(-1);
	}

	words() {
		return this.text.split(" ");
	}
}
