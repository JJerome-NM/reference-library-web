import { defineRouting } from "next-intl/routing"

export const APP_LOCALES = ["en", "uk"] as const
export type AppLocale = (typeof APP_LOCALES)[number]

export const routing = defineRouting({
  locales: APP_LOCALES,
  defaultLocale: "en",
  localePrefix: "always",
})
