"use client"

import { useTranslations } from "next-intl"
import { SlidersHorizontal } from "lucide-react"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Switch } from "@workspace/ui/components/switch"
import { usePublicationSearchParams } from "@/src/features/publication-search/model/use-publication-search-params"

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

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <SlidersHorizontal className="size-3.5 text-blue-600" aria-hidden="true" />
          {tCommon("searchFilters")}
        </span>
        <button
          type="button"
          onClick={clearAll}
          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold transition-colors cursor-pointer"
        >
          {tCommon("clear")}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground block">
          {t("yearRange")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="2020"
            value={yearFrom ?? ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : null
              updateParams({ from: val, page: null })
            }}
            className="w-full h-8 px-2.5 text-xs font-mono rounded-lg border border-border text-foreground focus:outline-none focus:border-blue-500 bg-muted/30"
          />
          <input
            type="number"
            placeholder="2026"
            value={yearTo ?? ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : null
              updateParams({ to: val, page: null })
            }}
            className="w-full h-8 px-2.5 text-xs font-mono rounded-lg border border-border text-foreground focus:outline-none focus:border-blue-500 bg-muted/30"
          />
        </div>
        <div className="flex gap-1 pt-0.5">
          <button
            type="button"
            onClick={() => updateParams({ from: currentYear, to: currentYear, page: null })}
            className="flex-1 py-1 text-[10px] font-semibold rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors cursor-pointer"
          >
            {currentYear}
          </button>
          <button
            type="button"
            onClick={() => updateParams({ from: currentYear - 3, to: currentYear, page: null })}
            className="flex-1 py-1 text-[10px] font-semibold rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 transition-colors cursor-pointer"
          >
            {t("threeYears")}
          </button>
          <button
            type="button"
            onClick={() => updateParams({ from: null, to: null, page: null })}
            className="flex-1 py-1 text-[10px] font-semibold rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors cursor-pointer"
          >
            {t("all")}
          </button>
        </div>
      </div>

      <hr className="border-border/60" />

      <div className="space-y-2.5">
        <label className="text-xs font-bold text-foreground block">
          {t("journals")}
        </label>
        <div className="space-y-2 text-xs text-muted-foreground">
          {AVAILABLE_JOURNALS.map((j) => {
            const isSelected = selectedJournals.includes(j.title)
            return (
              <div
                key={j.title}
                className="flex items-center justify-between group cursor-pointer"
                onClick={() => toggleJournal(j.title)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={isSelected}
                    onChange={() => toggleJournal(j.title)}
                    aria-label={j.title}
                  />
                  <span className="group-hover:text-foreground line-clamp-1 select-none">
                    {j.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {j.count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <hr className="border-border/60" />

      <div className="space-y-3 text-xs">
        <label className="text-xs font-bold text-foreground block">
          {t("citationsAndSources")}
        </label>

        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground select-none">
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

        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground select-none">
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
  )
}
