import { expect, test } from "./fixtures";

test("Opens a new tab with the bob welcome page", async ({
	extensionId,
	context,
}) => {
	const newPage = await context.waitForEvent("page");
	await newPage.waitForLoadState();
	expect(newPage.url()).toBe(
		`chrome-extension://${extensionId}/src/core/views/welcome/index.html`,
	);
	expect(await newPage.title()).toBe(
		"Welcome to Bob. This is Bob, a command palette for your browser.",
	);
});
