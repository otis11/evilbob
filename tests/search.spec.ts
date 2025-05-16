import { expect, test } from "./fixtures.ts";

test("When typing a ! renders the bang list, when removing ! renders commands again", async ({
	openedPage,
}) => {
	await expect(openedPage.getByTestId("search-input")).toBeFocused();
	await openedPage.keyboard.press("!");
	await expect(openedPage.getByTestId("bangs-list")).toBeVisible();
	await expect(openedPage.getByTestId("command-list")).not.toBeVisible();
	await openedPage.keyboard.press("Backspace");
	await expect(openedPage.getByTestId("bangs-list")).not.toBeVisible();
	await expect(openedPage.getByTestId("command-list")).toBeVisible();
});

test("When opening evilbob renders the command list and focuses the input", async ({
	openedPage,
}) => {
	await expect(openedPage.getByTestId("command-list")).toBeVisible();
	await expect(openedPage.getByTestId("search-input")).toBeFocused();
});
