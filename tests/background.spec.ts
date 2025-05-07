import { expect, test } from "./fixtures";

test("extensionId should not be empty", async ({ page, extensionId }) => {
	expect(extensionId).not.toBe("");
});
