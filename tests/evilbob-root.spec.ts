import { expect, test } from "./fixtures.ts";

test("The dialog should be visible when evilbob open message gets sent", async ({
	context,
	page,
	extensionUrl,
	openEvilbob,
}) => {
	await page.goto(`${extensionUrl}/src/views/welcome/welcome.html`);
	await openEvilbob();
	await expect(page.getByTestId("evilbob-dialog")).toBeVisible();
});
