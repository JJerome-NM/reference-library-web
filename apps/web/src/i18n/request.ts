import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing, type AppLocale } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale: AppLocale = hasLocale(routing.locales, requested)
    ? (requested as AppLocale)
    : (routing.defaultLocale as AppLocale)

  return {
    locale,
    messages: (await import(`../../messages/${locale}`)).default,
  }
})
