"use client"

import { useTranslations } from "next-intl"
import { BarChart2 } from "lucide-react"
import { Card } from "@workspace/ui/components/card"
import { useHomeSummary } from "@/src/entities/home-summary"
import { cn } from "@workspace/ui/lib/utils"

interface PlatformStatsCardProps {
  highlightAuthor?: boolean
  highlightJournal?: boolean
  highlightInstitution?: boolean
}

export function PlatformStatsCard({
  highlightAuthor = false,
  highlightJournal = false,
  highlightInstitution = false,
}: PlatformStatsCardProps) {
  const t = useTranslations("common")
  const { summary } = useHomeSummary()

  const pubCount = summary?.numOfPublications ?? 4952
  const authorCount = summary?.numOfAuthors ?? 606
  const journalCount = summary?.numOfJournalsWithVersions ?? 37
  const instCount = summary?.numOfInstitutions ?? 67

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <BarChart2 className="size-3.5 text-blue-600" aria-hidden="true" />
          {t("statsTitle")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight block">
            {t("statsPublications")}
          </span>
          <span className="text-lg font-extrabold text-foreground font-mono tracking-tight">
            {pubCount.toLocaleString("uk-UA")}
          </span>
        </div>

        <div
          className={cn(
            "p-3 rounded-xl border",
            highlightAuthor
              ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/60"
              : "bg-muted/50 border-border/50"
          )}
        >
          <span
            className={cn(
              "text-[10px] uppercase tracking-tight block",
              highlightAuthor
                ? "font-bold text-blue-700 dark:text-blue-400"
                : "font-semibold text-muted-foreground"
            )}
          >
            {t("statsAuthors")}
          </span>
          <span
            className={cn(
              "text-lg font-extrabold font-mono tracking-tight",
              highlightAuthor
                ? "text-blue-700 dark:text-blue-400"
                : "text-foreground"
            )}
          >
            {authorCount.toLocaleString("uk-UA")}
          </span>
        </div>

        <div
          className={cn(
            "p-3 rounded-xl border",
            highlightJournal
              ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/60"
              : "bg-muted/50 border-border/50"
          )}
        >
          <span
            className={cn(
              "text-[10px] uppercase tracking-tight block",
              highlightJournal
                ? "font-bold text-blue-700 dark:text-blue-400"
                : "font-semibold text-muted-foreground"
            )}
          >
            {t("statsJournals")}
          </span>
          <span
            className={cn(
              "text-lg font-extrabold font-mono tracking-tight",
              highlightJournal
                ? "text-blue-700 dark:text-blue-400"
                : "text-foreground"
            )}
          >
            {journalCount.toLocaleString("uk-UA")}
          </span>
        </div>

        <div
          className={cn(
            "p-3 rounded-xl border",
            highlightInstitution
              ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/60"
              : "bg-muted/50 border-border/50"
          )}
        >
          <span
            className={cn(
              "text-[10px] uppercase tracking-tight block",
              highlightInstitution
                ? "font-bold text-blue-700 dark:text-blue-400"
                : "font-semibold text-muted-foreground"
            )}
          >
            {t("statsInstitutions")}
          </span>
          <span
            className={cn(
              "text-lg font-extrabold font-mono tracking-tight",
              highlightInstitution
                ? "text-blue-700 dark:text-blue-400"
                : "text-foreground"
            )}
          >
            {instCount.toLocaleString("uk-UA")}
          </span>
        </div>
      </div>
    </Card>
  )
}
