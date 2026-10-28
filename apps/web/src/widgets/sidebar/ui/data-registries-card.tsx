"use client"

import { useTranslations } from "next-intl"
import { Building2, BookOpen, FileText, Users } from "lucide-react"
import { Link, usePathname } from "@/src/i18n/navigation"
import { APP_ROUTES } from "@/src/shared/config"
import { cn } from "@workspace/ui/lib/utils"

export function DataRegistriesCard() {
  const t = useTranslations("common")
  const pathname = usePathname()

  const isPublicationsActive = pathname === APP_ROUTES.HOME || pathname === APP_ROUTES.PUBLICATIONS
  const isAuthorsActive = pathname.startsWith(APP_ROUTES.AUTHORS)
  const isJournalsActive = pathname.startsWith(APP_ROUTES.JOURNALS)
  const isInstitutionsActive = pathname.startsWith(APP_ROUTES.INSTITUTIONS)

  return (
    <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-3 shadow-xs space-y-1 text-xs">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 px-2 pt-0.5 pb-1 block select-none">
        {t("dataRegistries")}
      </span>

      <Link
        href={APP_ROUTES.HOME}
        className={cn(
          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
          isPublicationsActive
            ? "bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium"
        )}
      >
        <span className="flex items-center gap-2">
          <FileText
            className={cn(
              "size-3.5 shrink-0",
              isPublicationsActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
          <span>{t("statsPublications")}</span>
        </span>
        <span
          className={cn(
            "text-[11px] font-mono",
            isPublicationsActive
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-muted-foreground/60"
          )}
        >
          4 952
        </span>
      </Link>

      <Link
        href={APP_ROUTES.AUTHORS}
        className={cn(
          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
          isAuthorsActive
            ? "bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium"
        )}
      >
        <span className="flex items-center gap-2">
          <Users
            className={cn(
              "size-3.5 shrink-0",
              isAuthorsActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
          <span>{t("statsAuthors")}</span>
        </span>
        <span
          className={cn(
            "text-[11px] font-mono",
            isAuthorsActive
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-muted-foreground/60"
          )}
        >
          606
        </span>
      </Link>

      <Link
        href={APP_ROUTES.JOURNALS}
        className={cn(
          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
          isJournalsActive
            ? "bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium"
        )}
      >
        <span className="flex items-center gap-2">
          <BookOpen
            className={cn(
              "size-3.5 shrink-0",
              isJournalsActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
          <span>{t("statsJournals")}</span>
        </span>
        <span
          className={cn(
            "text-[11px] font-mono",
            isJournalsActive
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-muted-foreground/60"
          )}
        >
          37
        </span>
      </Link>

      <Link
        href={APP_ROUTES.INSTITUTIONS}
        className={cn(
          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
          isInstitutionsActive
            ? "bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium"
        )}
      >
        <span className="flex items-center gap-2">
          <Building2
            className={cn(
              "size-3.5 shrink-0",
              isInstitutionsActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
          <span>{t("statsInstitutions")}</span>
        </span>
        <span
          className={cn(
            "text-[11px] font-mono",
            isInstitutionsActive
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-muted-foreground/60"
          )}
        >
          67
        </span>
      </Link>
    </div>
  )
}
