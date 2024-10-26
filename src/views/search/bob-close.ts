import { focusLastActiveWindow } from "../../util/last-active-window";

export async function onBobClose() {
	await focusLastActiveWindow();
}
