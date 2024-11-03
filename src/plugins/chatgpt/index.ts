import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import { Search } from "../../core/components/search";
import { iconBrain, iconFromString } from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import { focusLastActiveWindow } from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	prefix: "gpt",
	description() {
		return t("ChatGPT.description");
	},

	name(): string {
		return t("ChatGPT");
	},
	async provideResults(): Promise<Result[]> {
		return [new ChatGPTStartChat()];
	},
	onLocalChange(locale) {
		setLocale(locale);
	},
	icon: iconBrain,
});

export class ChatGPTStartChat extends Result {
	title(): string {
		return t("ChatGPTStartChat.title");
	}

	options() {
		return [new ChatGPTStartChatQuery()];
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconBrain);
	}
	async execute(): Promise<void> {
		this.emitShowOptionsEvent();
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

	async execute(state: BobWindowState): Promise<void> {
		const query = encodeURI(state.currentSearch.text);
		await chrome.tabs.create({ url: `https://chatgpt.com?q=${query}` });
		await focusLastActiveWindow();
	}
}
