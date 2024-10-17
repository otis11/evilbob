export type SearchConfig = {
	text: string;
	selectionStart: number | null;
	inputElement?: HTMLInputElement;
};

export class Search {
	static MODIFIER_PREFIX = "!";

	originalText: string;
	text: string;
	modifier: string[];
	selectionStart: number | null;
	inputElement?: HTMLInputElement;

	constructor(config: SearchConfig) {
		this.originalText = config.text;
		this.selectionStart = config.selectionStart;
		this.inputElement = config.inputElement;

		[this.text, this.modifier] = this.parseString(config.text);
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
		return this.originalText.trim().length === 0;
	}

	parseString(str: string): [string, string[]] {
		const matches = str.match(/![a-zA-Z0-9]+/g);
		if (!matches) {
			return [str, []];
		}
		const modifier = [];
		let strWithoutModifier = str;
		for (const match of matches) {
			strWithoutModifier = strWithoutModifier.replace(match, "");
			modifier.push(match);
		}
		return [strWithoutModifier, modifier];
	}
}
