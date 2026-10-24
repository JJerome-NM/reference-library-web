import type { AppLocale } from "@/src/i18n/routing"

export interface LocaleOption {
  code: AppLocale
  label: string
  shortLabel: string
  dir: "ltr" | "rtl"
}

export const SUPPORTED_LOCALES: readonly LocaleOption[] = [
  {
    code: "en",
    label: "English",
    shortLabel: "EN",
    dir: "ltr",
  },
  {
    code: "uk",
    label: "Українська",
    shortLabel: "УКР",
    dir: "ltr",
  },
] as const

export const DEFAULT_LOCALE: AppLocale = "en"
