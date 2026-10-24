"use client"

import { useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/src/i18n/navigation"
import { SUPPORTED_LOCALES } from "@/src/shared/config/i18n"
import type { AppLocale } from "@/src/i18n/routing"
import { cn } from "@workspace/ui/lib/utils"

export function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher")
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function handleLocaleChange(nextLocale: AppLocale) {
    if (nextLocale === currentLocale) {
      return
    }

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-1 text-xs"
    >
      {SUPPORTED_LOCALES.map(({ code, shortLabel, label }) => {
        const isActive = currentLocale === code

        return (
          <button
            key={code}
            type="button"
            disabled={isPending}
            onClick={() => handleLocaleChange(code)}
            aria-pressed={isActive}
            aria-label={`${label} (${shortLabel})`}
            className={cn(
              "relative rounded-md px-2.5 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-50",
              isActive
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {shortLabel}
          </button>
        )
      })}
    </div>
  )
}
