import { getConfig, updateConfig } from "../../config";
import { coreI18n } from "../../locales";
import { debounce } from "../../util/debounce";
import "../../global.css";
import "./main.css";
import { Result } from "../../components/result/result";
import { Search } from "../../components/search";
import type { Tag } from "../../components/tags/tags";
import { iconChevronDoubleRight, iconFromString } from "../../icons";
import { loadPlugins } from "../../plugins";
import { loadCustomTheme } from "../../theme";

class MockResult extends Result {
	title(): string {
		return "Title";
	}

	description(): string {
		return "Description Title";
	}

	constructor() {
		super();
		this.search(new Search({ text: "Tit", selectionStart: 0 }));
	}

	tags(): Tag[] {
		return [
			{ text: "Tag" },
			{ text: "Tag", type: "success" },
			{ text: "Tag", type: "error" },
		];
	}

	async execute(): Promise<void> {}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconChevronDoubleRight);
	}

	options(): Result[] | undefined {
		return [new MockResult()];
	}
}

(async () => {
	const preview = document.getElementById("preview") as HTMLElement;
	preview.innerHTML = new MockResult().asHtmlElement().outerHTML;
	await loadPlugins();
	await loadCustomTheme();
	const config = await getConfig();
	coreI18n.setLocale(config.locale);
})();
const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
getConfig().then((config) => {
	coreI18n.setLocale(config.locale);
	textarea.value = config.customTheme;
});

textarea.addEventListener("input", () => {
	debounce(async () => {
		await updateConfig({
			customTheme: textarea.value,
		});
		await loadCustomTheme();
	}, 300);
});
