import { iconFromString, iconWindowClose } from "../../icons";
import { t } from "../../locale";
import {
	focusLastActiveWindow,
	getLastActiveWindow,
} from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class Window extends ResultGroup {
	public id(): string {
		return "window";
	}
	permissions = [];
	public prefix?: string | undefined = "win";
	public description(): string {
		return t("Window.description");
	}
	public name(): string {
		return t("Window");
	}

	public async getResults(): Promise<Result[]> {
		return [new CloseOtherWindows()];
	}
}

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
		focusLastActiveWindow();
	}
}
