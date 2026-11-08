import { chromium } from "@playwright/test"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"

interface RouteConfig {
  path: string
  name: string
}

const ROUTES: readonly RouteConfig[] = [
  { path: "/uk", name: "publications" },
  { path: "/uk/authors", name: "authors" },
  { path: "/uk/journals", name: "journals" },
  { path: "/uk/institutions", name: "institutions" },
]

async function inspect() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000"
  const outputDir = join(process.cwd(), ".preview")
  await mkdir(outputDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })

  for (const route of ROUTES) {
    const page = await context.newPage()
    const targetUrl = `${baseUrl}${route.path}`
    const consoleErrors: string[] = []

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })

    try {
      const response = await page.goto(targetUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      })
      const status = response?.status() ?? 0
      const title = await page.title()
      const screenshotPath = join(outputDir, `${route.name}.png`)

      await page.screenshot({ path: screenshotPath, fullPage: true })

      console.log(
        JSON.stringify({
          route: route.path,
          status,
          title,
          screenshot: screenshotPath,
          errorsCount: consoleErrors.length,
          errors: consoleErrors,
        })
      )
    } catch (error) {
      console.error(
        JSON.stringify({
          route: route.path,
          error: error instanceof Error ? error.message : String(error),
        })
      )
    } finally {
      await page.close()
    }
  }

  await browser.close()
}

inspect().catch((err) => {
  console.error(err)
  process.exit(1)
})
