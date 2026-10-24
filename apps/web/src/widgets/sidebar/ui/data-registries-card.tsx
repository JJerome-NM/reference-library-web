"use client"

import { useTranslations } from "next-intl"
import { Building2, BookOpen, FileText, Users } from "lucide-react"
import { Link, usePathname } from "@/src/i18n/navigation"
import { Card } from "@workspace/ui/components/card"
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
    <Card className="p-4 space-y-1 text-xs font-semibold">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground px-2 block pb-1">
        {t("dataRegistries")}
      </span>

      <Link
        href={APP_ROUTES.HOME}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-xl transition-colors",
          isPublicationsActive
            ? "text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50"
            : "text-foreground hover:bg-muted"
        )}
      >
        <span className="flex items-center gap-2">
          <FileText className="size-4 text-blue-600" aria-hidden="true" />
          {t("statsPublications")}
        </span>
        <span className="text-[11px] font-mono font-medium">4 952</span>
      </Link>

      <Link
        href={APP_ROUTES.AUTHORS}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-xl transition-colors",
          isAuthorsActive
            ? "text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50"
            : "text-foreground hover:bg-muted"
        )}
      >
        <span className="flex items-center gap-2">
          <Users
            className={cn("size-4", isAuthorsActive ? "text-blue-600" : "text-slate-400")}
            aria-hidden="true"
          />
          {t("statsAuthors")}
        </span>
        <span className="text-[11px] font-mono font-medium">606</span>
      </Link>

      <Link
        href={APP_ROUTES.JOURNALS}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-xl transition-colors",
          isJournalsActive
            ? "text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50"
            : "text-foreground hover:bg-muted"
        )}
      >
        <span className="flex items-center gap-2">
          <BookOpen
            className={cn("size-4", isJournalsActive ? "text-blue-600" : "text-slate-400")}
            aria-hidden="true"
          />
          {t("statsJournals")}
        </span>
        <span className="text-[11px] font-mono font-medium">37</span>
      </Link>

      <Link
        href={APP_ROUTES.INSTITUTIONS}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-xl transition-colors",
          isInstitutionsActive
            ? "text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50"
            : "text-foreground hover:bg-muted"
        )}
      >
        <span className="flex items-center gap-2">
          <Building2
            className={cn("size-4", isInstitutionsActive ? "text-blue-600" : "text-slate-400")}
            aria-hidden="true"
          />
          {t("statsInstitutions")}
        </span>
        <span className="text-[11px] font-mono text-muted-foreground font-medium">67</span>
      </Link>
    </Card>
  )
}
