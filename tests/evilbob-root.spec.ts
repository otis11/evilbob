import { expect, test } from "./fixtures.ts";

test("The evilbob-root dialog can be opened and closed", async ({
	openedPage,
}) => {
	await expect(openedPage.getByTestId("evilbob-dialog")).toBeVisible();
	await openedPage.keyboard.press("Escape");
	await expect(openedPage.getByTestId("evilbob-dialog")).not.toBeVisible();
});
