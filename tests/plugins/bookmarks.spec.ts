import { expect, test } from "../fixtures";

test.use({ config: { plugins: { enabled: { bookmarks: true } } } });
test("Bookmark plugin commands are visible when opening Evilbob", async ({
	openedPage,
}) => {
	await expect(
		openedPage.getByTestId("command-bookmarks-bookmarks"),
	).toBeVisible();
	await expect(
		openedPage.getByTestId("command-bookmarks-bookmark-current-tab"),
	).toBeVisible();
	await expect(
		openedPage.getByTestId("command-bookmarks-remove-bookmark-current-tab"),
	).toBeVisible();
});
