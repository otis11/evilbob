export type SearchConfig = {
	text: string;
	selectionStart: number | null;
	inputElement?: HTMLInputElement;
};

export class Search {
	text: string;
	selectionStart: number | null;
	inputElement?: HTMLInputElement;

	constructor(config: SearchConfig) {
		this.text = config.text;
		this.selectionStart = config.selectionStart;
		this.inputElement = config.inputElement;
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

	isEmpty() {
		return this.text.trim().length === 0;
	}
}
