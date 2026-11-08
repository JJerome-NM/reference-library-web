import { test, expect } from "@playwright/test"

test.describe("Core Pages Availability and UI", () => {
  test("publications page loads successfully", async ({ page }) => {
    const response = await page.goto("/uk")
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/Академічний Індекс/i)
    await expect(page.locator("header")).toBeVisible()
    await expect(page.locator("main")).toBeVisible()
    await expect(page.locator("aside")).toBeVisible()
  })

  test("authors page loads successfully", async ({ page }) => {
    const response = await page.goto("/uk/authors")
    expect(response?.status()).toBe(200)
    await expect(page.locator("header")).toBeVisible()
    await expect(page.locator("main")).toBeVisible()
    await expect(page.locator("table")).toBeVisible()
  })

  test("journals page loads successfully", async ({ page }) => {
    const response = await page.goto("/uk/journals")
    expect(response?.status()).toBe(200)
    await expect(page.locator("header")).toBeVisible()
    await expect(page.locator("main")).toBeVisible()
    await expect(page.locator("table")).toBeVisible()
  })

  test("institutions page loads successfully", async ({ page }) => {
    const response = await page.goto("/uk/institutions")
    expect(response?.status()).toBe(200)
    await expect(page.locator("header")).toBeVisible()
    await expect(page.locator("main")).toBeVisible()
    await expect(page.locator("table")).toBeVisible()
  })
})
