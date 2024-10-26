import { iconBrain, iconFromString } from "../../icons";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { Search } from "../search";

export class ResultGroupChatGPT extends ResultGroup {
	permissions = [];
	public prefix?: string | undefined = "gpt";
	description = "Start a chat with chatgpt";

	public async getResults(): Promise<Result[]> {
		return [new ResultChatGPTStartChat()];
	}
}

export class ResultChatGPTStartChat extends Result {
	options?: ResultGroup | undefined =
		new ResultGroupChatGPTStartChatOptions();
	constructor() {
		super({
			title: "ChatGPT start conversation",
			description: "",
			prepend: iconFromString(iconBrain),
		});
	}
	async execute(search: Search): Promise<void> {
		this.emitShowOptionsEvent();
	}
}

export class ResultGroupChatGPTStartChatOptions extends ResultGroup {
	public async getResults(): Promise<Result[]> {
		return [new ResultChatGPTStartChatQuery()];
	}
}

export class ResultChatGPTStartChatQuery extends Result {
	public search(search: Search) {
		return this.makeFakeSearch(
			new Search({
				text: "",
				selectionStart: 0,
			}),
			search.minMatchScore() + 1,
		);
	}

	constructor() {
		super({
			title: "Prompt ChatGPT.",
			description: "",
			prepend: iconFromString(iconBrain),
		});
	}
	async execute(search: Search): Promise<void> {
		const query = encodeURI(search.text);
		await chrome.tabs.create({ url: `https://chatgpt.com?q=${query}` });
		focusLastActiveWindow();
	}
}
