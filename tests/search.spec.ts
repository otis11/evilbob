import { expect, test } from "./fixtures.ts";

test("When typing a ! renders the bang list, when removing ! renders commands again", async ({
	page,
	extensionUrl,
	openEvilbob,
}) => {
	await page.goto(`${extensionUrl}/src/views/welcome/welcome.html`);
	await openEvilbob();
	await expect(page.getByTestId("search-input")).toBeFocused();
	await page.keyboard.press("!");
	await expect(page.getByTestId("bangs-list")).toBeVisible();
	await expect(page.getByTestId("command-list")).not.toBeVisible();
	await page.keyboard.press("Backspace");
	await expect(page.getByTestId("bangs-list")).not.toBeVisible();
	await expect(page.getByTestId("command-list")).toBeVisible();
});

test("When opening evilbob renders the command list and focuses the input", async ({
	page,
	extensionUrl,
	openEvilbob,
}) => {
	await page.goto(`${extensionUrl}/src/views/welcome/welcome.html`);
	await openEvilbob();
	await expect(page.getByTestId("command-list")).toBeVisible();
	await expect(page.getByTestId("search-input")).toBeFocused();
});
