import { expect, test } from "./fixtures.ts";

test("Welcome page should contain a link to plugins and a keybinding notice to open", async ({
	context,
	page,
	extensionUrl,
}) => {
	await page.goto(`${extensionUrl}/src/views/welcome/welcome.html`);
	await expect(page.getByText("To open me press")).toBeVisible();
	const newPagePromise = context.waitForEvent("page");
	await page.getByRole("button", { name: "Choose Your Plugins" }).click();
	const newPage = await newPagePromise;
	await expect(newPage).toHaveURL(
		`${extensionUrl}/src/views/plugins/plugins.html`,
	);
});
