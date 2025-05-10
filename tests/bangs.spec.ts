import { expect, test } from "./fixtures.ts";

test("The evilbob-root dialog can be opened and closed", async ({
	context,
	page,
	extensionUrl,
	openEvilbob,
}) => {
	await page.goto(`${extensionUrl}/src/views/welcome/welcome.html`);
	await openEvilbob();
	await page.keyboard.press("!");
	await expect(page.getByTestId("bangs-list")).toBeVisible();
});
