import { iconFromString, iconWindowClose } from "../../icons";
import { getLastActiveWindow } from "../../util/last-active-window";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";

export class ResultGroupWindow extends ResultGroup {
	permissions = [];
	public prefix?: string | undefined = "win";
	public description =
		"Interact with chrome windows, for instance 'close other windows'";

	public async getResults(): Promise<Result[]> {
		return [new ResultCloseOtherWindows()];
	}
}

export class ResultCloseOtherWindows extends Result {
	constructor() {
		super({
			title: "Close other windows",
			description: "",
			prepend: iconFromString(iconWindowClose),
		});
	}
	async execute(): Promise<void> {
		const lastActiveWindow = await getLastActiveWindow();
		const windows = await chrome.windows.getAll();
		for (const w of windows) {
			if (w.id && w.id !== lastActiveWindow.id) {
				await chrome.windows.remove(w.id);
			}
		}
		window.close();
	}
}
