import { defineRouting } from "next-intl/routing"

export const APP_LOCALES = ["en", "uk"]

export const routing = defineRouting({
  locales: APP_LOCALES,
  defaultLocale: "en",
  localePrefix: "always",
})
