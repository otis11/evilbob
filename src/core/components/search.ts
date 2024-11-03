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

	words() {
		return this.text.split(" ");
	}
}
