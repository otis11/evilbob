import { expect, test } from "./fixtures";

test("search view loads with correct title", async ({ page, extensionId }) => {
	await page.goto(
		`chrome-extension://${extensionId}/src/core/views/search/index.html`,
	);
	expect(await page.title()).toBe(
		"Hi! This is Bob, a command palette for your browser.",
	);
});

test("search view focuses the search field input on open", async ({
	page,
	extensionId,
}) => {
	await page.goto(
		`chrome-extension://${extensionId}/src/core/views/search/index.html`,
	);
	const focusedId = await page.locator("*:focus").first().getAttribute("id");
	expect(focusedId).toBe("search");
});
