export interface TextHistoryProps {
	maxEntries?: number;
}

export class TextHistory {
	entries: string[] = [];

	maxEntries: number;

	private currentIndex = 0;

	constructor(props?: TextHistoryProps) {
		this.maxEntries = props?.maxEntries || 20;
	}

	public push(text: string) {
		this.entries.push(text);
		this.currentIndex = this.entries.length - 1;
		return this;
	}

	public back() {
		this.currentIndex = Math.max(0, this.currentIndex - 1);
		return this;
	}

	public forward() {
		this.currentIndex = Math.min(
			this.currentIndex + 1,
			this.entries.length - 1,
		);
		return this;
	}

	public value() {
		return this.entries[this.currentIndex] || "";
	}
}
