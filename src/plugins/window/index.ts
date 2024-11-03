import { defineBobPlugin } from "../../core/BobPlugin";
import { Result } from "../../core/components/result/result";
import {
	iconFromString,
	iconWindowClose,
	iconWindowRestore,
} from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import {
	focusLastActiveWindow,
	getLastActiveWindow,
} from "../../core/util/last-active-window";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
	prefix: "win",
	description() {
		return t("Window.description");
	},
	name() {
		return t("Window");
	},
	async provideResults() {
		return [new CloseOtherWindows()];
	},
	onLocalChange(locale) {
		setLocale(locale);
	},
	icon: iconWindowRestore,
});

export class CloseOtherWindows extends Result {
	title(): string {
		return t("CloseOtherWindows");
	}
	prepend(): HTMLElement | undefined {
		return iconFromString(iconWindowClose);
	}

	async execute(): Promise<void> {
		const lastActiveWindow = await getLastActiveWindow();
		const windows = await chrome.windows.getAll();
		for (const w of windows) {
			if (w.id && w.id !== lastActiveWindow.id) {
				await chrome.windows.remove(w.id);
			}
		}
		await focusLastActiveWindow();
	}
}
