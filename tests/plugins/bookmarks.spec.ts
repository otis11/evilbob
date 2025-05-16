import { expect, test } from "../fixtures";

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

test.use({ config: { plugins: { enabled: { bookmarks: true } } } });
test("Can bookmark current tab and remove current tab as bookmark", async ({
	openedPage,
	extensionUrl,
}) => {
	await test.step("bookmark tab", async () => {
		await openedPage
			.getByTestId("command-bookmarks-bookmark-current-tab")
			.click();
		await openedPage.waitForTimeout(10);
		const results = await openedPage.evaluate(() =>
			chrome.bookmarks.search({ query: "welcome" }),
		);
		expect(results[0]?.url).toBe(openedPage.url());
	});
	await test.step("remove bookmark tab", async () => {
		await openedPage
			.getByTestId("command-bookmarks-remove-bookmark-current-tab")
			.click();
		await openedPage.waitForTimeout(10);
		const results = await openedPage.evaluate(() =>
			chrome.bookmarks.search({ query: "welcome" }),
		);
		expect(results.length).toBe(0);
	});
});
