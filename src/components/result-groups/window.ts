import { iconFromString, iconWindowClose } from "../../icons";
import {
	focusLastActiveWindow,
	getLastActiveWindow,
} from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class Window extends ResultGroup {
	permissions = [];
	public prefix?: string | undefined = "win";
	public description(): string {
		return "Interact with chrome windows, for instance 'close other windows'";
	}
	public name(): string {
		return "Window";
	}

	public async getResults(): Promise<Result[]> {
		return [new CloseOtherWindows()];
	}
}

export class CloseOtherWindows extends Result {
	title(): string {
		return "Close other windows";
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
