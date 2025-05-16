import type { Page } from "@playwright/test";
import { expect, test } from "../fixtures";

const COLOR_NAME = "my-first-color";
test.use({ config: { plugins: { enabled: { colors: true } } } });
test("Can add a new color and find it under colors view and remove it", async ({
	openedPage,
}) => {
	await addColor(openedPage);

	await openedPage.getByTestId("command-colors-colors").click();
	await expect(openedPage.getByTestId(`colors-${COLOR_NAME}`)).toBeVisible();
});

test("Can edit a color", async ({ openedPage }) => {
	await addColor(openedPage);

	await openedPage.getByTestId("command-colors-colors").click();
	await expect(openedPage.getByTestId(`colors-${COLOR_NAME}`)).toBeVisible();

	await openedPage.getByTestId("actions-trigger").click();
	await openedPage.getByText("Edit").click();
	await openedPage.getByTestId("colors-title").fill("new-color-name");
	await openedPage.getByTestId("colors-save").click();

	await expect(openedPage.getByTestId("colors-new-color-name")).toBeVisible();
});

test("Can remove a color", async ({ openedPage }) => {
	await addColor(openedPage);

	await openedPage.getByTestId("command-colors-colors").click();
	await expect(openedPage.getByTestId(`colors-${COLOR_NAME}`)).toBeVisible();

	await openedPage.getByTestId("actions-trigger").click();
	await openedPage.getByText("Remove").click();

	await expect(
		openedPage.getByTestId(`colors-${COLOR_NAME}`),
	).not.toBeVisible();
});

async function addColor(page: Page) {
	await page.getByTestId("command-colors-add-color").click();
	await page.getByTestId("colors-title").fill(`${COLOR_NAME}`);
	await page.getByTestId("colors-save").click();
	await page.getByTestId("back").click();
}
