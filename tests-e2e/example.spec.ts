import { test, expect } from "@playwright/test";

test.describe("Quiz Builder E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("create → preview → refresh → restore (happy path)", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByText("Start by adding your first question")
    ).toBeVisible();

    await page.getByRole("button", { name: /add question/i }).click();

    await expect(
      page.getByRole("heading", { name: /Question 1/i })
    ).toBeVisible();

    const questionInput = page.getByPlaceholder(/enter your question/i);
    await questionInput.fill("What is the capital of France?");

    await expect(page.locator('input[value="Option A"]')).toBeVisible();
    await expect(page.locator('input[value="Option B"]')).toBeVisible();

    const previewTab = page.getByRole("tab", { name: /preview/i });
    await expect(previewTab).not.toHaveAttribute("aria-disabled", "true");
    await previewTab.click();

    await expect(
      page.getByText("What is the capital of France?")
    ).toBeVisible();
    await expect(page.getByText("Option A")).toBeVisible();
    await expect(page.getByText("Option B")).toBeVisible();
    await expect(page.getByText("Question 1 of 1")).toBeVisible();

    await page.reload();

    await expect(
      page.getByText("What is the capital of France?")
    ).toBeVisible();
    await expect(page.getByText("Question 1 of 1")).toBeVisible();

    await page.getByRole("tab", { name: /edit/i }).click();
    await expect(
      page.getByRole("heading", { name: /Question 1/i })
    ).toBeVisible();
    await expect(
      page.locator('input[value="What is the capital of France?"]')
    ).toBeVisible();
  });
});
