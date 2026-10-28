"use client"

import { useTranslations } from "next-intl"
import { SlidersHorizontal, Calendar } from "lucide-react"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Switch } from "@workspace/ui/components/switch"
import { usePublicationSearchParams } from "@/src/features/publication-search/model/use-publication-search-params"
import { cn } from "@workspace/ui/lib/utils"

interface JournalOption {
  title: string
  count: number
}

const AVAILABLE_JOURNALS: readonly JournalOption[] = [
  { title: "Fungal Biology", count: 1 },
  { title: "Int. Journal of Thermofluids", count: 1 },
  { title: "Науковий Вісник НГУ", count: 2 },
  { title: "Computers & Geosciences", count: 1 },
]

export function PublicationFiltersCard() {
  const tCommon = useTranslations("common")
  const t = useTranslations("publicationsFeed")
  const {
    yearFrom,
    yearTo,
    selectedJournals,
    onlyWithCitations,
    onlyWithReferences,
    updateParams,
    toggleJournal,
    clearAll,
  } = usePublicationSearchParams()

  const currentYear = new Date().getFullYear()

  const isAllYearsActive = yearFrom === undefined && yearTo === undefined
  const isCurrentYearActive = yearFrom === currentYear && yearTo === currentYear
  const isThreeYearsActive = yearFrom === currentYear - 3 && yearTo === currentYear

  return (
    <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-3.5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
          <SlidersHorizontal className="size-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>{tCommon("searchFilters")}</span>
        </span>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors cursor-pointer"
        >
          {tCommon("clear")}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Calendar className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span>{t("yearRange")}</span>
        </label>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/30 dark:bg-muted/20 border border-border/40">
          <button
            type="button"
            onClick={() => updateParams({ from: null, to: null, page: null })}
            className={cn(
              "flex-1 py-1 text-xs rounded-lg transition-all text-center cursor-pointer select-none",
              isAllYearsActive
                ? "bg-blue-600 text-white font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
            )}
          >
            {t("all")}
          </button>
          <button
            type="button"
            onClick={() => updateParams({ from: currentYear, to: currentYear, page: null })}
            className={cn(
              "flex-1 py-1 text-xs rounded-lg transition-all text-center cursor-pointer select-none",
              isCurrentYearActive
                ? "bg-blue-600 text-white font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
            )}
          >
            {currentYear}
          </button>
          <button
            type="button"
            onClick={() => updateParams({ from: currentYear - 3, to: currentYear, page: null })}
            className={cn(
              "flex-1 py-1 text-xs rounded-lg transition-all text-center cursor-pointer select-none",
              isThreeYearsActive
                ? "bg-blue-600 text-white font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
            )}
          >
            {t("threeYears")}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <input
            type="number"
            placeholder={t("fromYear")}
            value={yearFrom ?? ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : null
              updateParams({ from: val, page: null })
            }}
            className="w-full h-7 px-2.5 text-xs font-mono rounded-lg border border-border/60 text-foreground placeholder:text-muted-foreground/60 bg-muted/20 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          <input
            type="number"
            placeholder={t("toYear")}
            value={yearTo ?? ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : null
              updateParams({ to: val, page: null })
            }}
            className="w-full h-7 px-2.5 text-xs font-mono rounded-lg border border-border/60 text-foreground placeholder:text-muted-foreground/60 bg-muted/20 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>
      </div>

      <hr className="border-border/50" />

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground block">
          {t("journals")}
        </label>
        <div className="space-y-0.5 text-xs">
          {AVAILABLE_JOURNALS.map((j) => {
            const isSelected = selectedJournals.includes(j.title)
            return (
              <label
                key={j.title}
                className={cn(
                  "flex items-center justify-between py-1 px-1.5 rounded-lg transition-colors cursor-pointer select-none",
                  isSelected
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <Checkbox
                    isSelected={isSelected}
                    onChange={() => toggleJournal(j.title)}
                    aria-label={j.title}
                  />
                  <span className="truncate text-xs">
                    {j.title}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[11px] font-mono shrink-0",
                    isSelected
                      ? "text-blue-600 dark:text-blue-400 font-bold"
                      : "text-muted-foreground/60"
                  )}
                >
                  {j.count}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <hr className="border-border/50" />

      <div className="space-y-2 text-xs">
        <label className="text-xs font-semibold text-foreground block">
          {t("citationsAndSources")}
        </label>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between py-0.5 px-1">
            <span
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
              onClick={() =>
                updateParams({ citations: onlyWithCitations ? null : "true", page: null })
              }
            >
              {t("onlyWithCitations")}
            </span>
            <Switch
              size="sm"
              isSelected={onlyWithCitations}
              onChange={(checked) =>
                updateParams({ citations: checked ? "true" : null, page: null })
              }
              aria-label={t("onlyWithCitations")}
            />
          </div>

          <div className="flex items-center justify-between py-0.5 px-1">
            <span
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
              onClick={() =>
                updateParams({ refs: onlyWithReferences ? null : "true", page: null })
              }
            >
              {t("onlyWithReferences")}
            </span>
            <Switch
              size="sm"
              isSelected={onlyWithReferences}
              onChange={(checked) =>
                updateParams({ refs: checked ? "true" : null, page: null })
              }
              aria-label={t("onlyWithReferences")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
