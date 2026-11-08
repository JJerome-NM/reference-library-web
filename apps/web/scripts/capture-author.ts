import { chromium } from "@playwright/test"
import { join } from "node:path"

async function capture() {
  const artifactDir = "C:\\Users\\jjero\\.gemini\\antigravity\\brain\\ca553ced-aabe-46ed-afc0-a0bc50286cd8"
  const url = "http://localhost:3000/uk/authors/0000-0001-9228-8459"

  const browser = await chromium.launch({ headless: true })

  const contextDesktopDark = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "dark",
  })
  const pageDark = await contextDesktopDark.newPage()
  await pageDark.goto(url, { waitUntil: "networkidle" })
  await pageDark.evaluate(() => {
    document.documentElement.classList.add("dark")
  })
  await pageDark.waitForTimeout(500)
  const darkPath = join(artifactDir, "author_profile_dark.png")
  await pageDark.screenshot({ path: darkPath, fullPage: true })
  await pageDark.close()

  const contextDesktopLight = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
  })
  const pageLight = await contextDesktopLight.newPage()
  await pageLight.goto(url, { waitUntil: "networkidle" })
  await pageLight.evaluate(() => {
    document.documentElement.classList.remove("dark")
  })
  await pageLight.waitForTimeout(500)
  const lightPath = join(artifactDir, "author_profile_light.png")
  await pageLight.screenshot({ path: lightPath, fullPage: true })
  await pageLight.close()

  await browser.close()
  console.log("Screenshots captured successfully:", { darkPath, lightPath })
}

capture().catch((err) => {
  console.error(err)
  process.exit(1)
})
