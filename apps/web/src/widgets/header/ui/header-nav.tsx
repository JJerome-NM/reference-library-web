"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/src/i18n/navigation"
import { APP_ROUTES } from "@/src/shared/config"
import { cn } from "@workspace/ui/lib/utils"

export function HeaderNav() {
  const t = useTranslations("common")
  const pathname = usePathname()

  const isPublicationsActive = pathname === APP_ROUTES.HOME || pathname === APP_ROUTES.PUBLICATIONS
  const isAuthorsActive = pathname.startsWith(APP_ROUTES.AUTHORS)
  const isJournalsActive = pathname.startsWith(APP_ROUTES.JOURNALS)
  const isInstitutionsActive = pathname.startsWith(APP_ROUTES.INSTITUTIONS)

  return (
    <nav aria-label="Global Navigation" className="hidden md:flex items-center gap-1 text-xs font-semibold text-muted-foreground">
      <Link
        href={APP_ROUTES.HOME}
        className={cn(
          "px-3 py-1.5 rounded-lg transition-colors",
          isPublicationsActive
            ? "text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-bold"
            : "hover:text-foreground hover:bg-muted"
        )}
      >
        {t("allPublications")}
      </Link>
      <Link
        href={APP_ROUTES.AUTHORS}
        className={cn(
          "px-3 py-1.5 rounded-lg transition-colors",
          isAuthorsActive
            ? "text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-bold"
            : "hover:text-foreground hover:bg-muted"
        )}
      >
        {t("allAuthors")}
      </Link>
      <Link
        href={APP_ROUTES.JOURNALS}
        className={cn(
          "px-3 py-1.5 rounded-lg transition-colors",
          isJournalsActive
            ? "text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-bold"
            : "hover:text-foreground hover:bg-muted"
        )}
      >
        {t("allJournals")}
      </Link>
      <Link
        href={APP_ROUTES.INSTITUTIONS}
        className={cn(
          "px-3 py-1.5 rounded-lg transition-colors",
          isInstitutionsActive
            ? "text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-bold"
            : "hover:text-foreground hover:bg-muted"
        )}
      >
        {t("allInstitutions")}
      </Link>
    </nav>
  )
}
