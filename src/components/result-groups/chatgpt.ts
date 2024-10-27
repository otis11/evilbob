import { iconBrain, iconFromString } from "../../icons";
import { t } from "../../locale";
import { focusLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import { Search } from "../search";

export class ChatGPT extends ResultGroup {
	permissions = [];
	public id(): string {
		return "chatgpt";
	}
	public prefix?: string | undefined = "gpt";
	public description(): string {
		return t("ChatGPT.description");
	}

	public name(): string {
		return t("ChatGPT");
	}
	public async getResults(): Promise<Result[]> {
		return [new ChatGPTStartChat()];
	}
}

export class ChatGPTStartChat extends Result {
	title(): string {
		return t("ChatGPTStartChat.title");
	}

	options(): ResultGroup | undefined {
		return new ChatGPTStartChatOptions();
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBrain);
	}
	async execute(search: Search): Promise<void> {
		this.emitShowOptionsEvent();
	}
}

export class ChatGPTStartChatOptions extends ResultGroup {
	public id(): string {
		return "chatgpt-options";
	}
	public description(): string {
		return "";
	}
	public name(): string {
		return "";
	}
	public async getResults(): Promise<Result[]> {
		return [new ChatGPTStartChatQuery()];
	}
}

export class ChatGPTStartChatQuery extends Result {
	public search(search: Search) {
		return this.makeFakeSearch(
			new Search({
				text: "",
				selectionStart: 0,
			}),
			search.minMatchScore + 1,
		);
	}

	title(): string {
		return t("ChatGPTStartChatQuery.title");
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconBrain);
	}

	async execute(search: Search): Promise<void> {
		const query = encodeURI(search.text);
		await chrome.tabs.create({ url: `https://chatgpt.com?q=${query}` });
		focusLastActiveWindow();
	}
}
