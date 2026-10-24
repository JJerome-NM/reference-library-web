"use client"

import { useTranslations } from "next-intl"
import { SlidersHorizontal, Globe } from "lucide-react"
import { useInstitutionSearchParams } from "@/src/features/institution-search"
import { cn } from "@workspace/ui/lib/utils"

export function InstitutionFiltersCard() {
  const tCommon = useTranslations("common")
  const t = useTranslations("institutionsPage")
  const {
    indexFrom,
    indexTo,
    country,
    updateParams,
    clearAll,
  } = useInstitutionSearchParams()

  const isGt10 = indexFrom === 10 && indexTo === undefined
  const isGt15 = indexFrom === 15 && indexTo === undefined
  const isAll = indexFrom === undefined && indexTo === undefined

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <SlidersHorizontal className="size-3.5 text-blue-600" aria-hidden="true" />
          {t("filterTitle")}
        </span>
        <button
          type="button"
          onClick={clearAll}
          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold transition-colors cursor-pointer"
        >
          {tCommon("reset")}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground block">
          {t("academicIndex")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-[10px] text-muted-foreground font-mono">
              {t("from")}
            </span>
            <input
              type="number"
              placeholder="0"
              value={indexFrom ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null
                updateParams({ from: val, page: null })
              }}
              className="w-full h-8 pl-8 pr-1 text-xs font-mono rounded-lg border border-border text-foreground focus:outline-none focus:border-blue-500 bg-muted/30"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-[10px] text-muted-foreground font-mono">
              {t("to")}
            </span>
            <input
              type="number"
              placeholder="25"
              value={indexTo ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null
                updateParams({ to: val, page: null })
              }}
              className="w-full h-8 pl-8 pr-1 text-xs font-mono rounded-lg border border-border text-foreground focus:outline-none focus:border-blue-500 bg-muted/30"
            />
          </div>
        </div>
        <div className="flex gap-1 pt-0.5">
          <button
            type="button"
            onClick={() => updateParams({ from: 10, to: null, page: null })}
            className={cn(
              "flex-1 py-1 text-[10px] font-semibold rounded-md font-mono transition-colors cursor-pointer",
              isGt10
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            &gt; 10
          </button>
          <button
            type="button"
            onClick={() => updateParams({ from: 15, to: null, page: null })}
            className={cn(
              "flex-1 py-1 text-[10px] font-semibold rounded-md font-mono transition-colors cursor-pointer",
              isGt15
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            &gt; 15
          </button>
          <button
            type="button"
            onClick={() => updateParams({ from: null, to: null, page: null })}
            className={cn(
              "flex-1 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer",
              isAll
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            {tCommon("allInstitutions")}
          </button>
        </div>
      </div>

      <hr className="border-border/60" />

      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Globe className="size-3.5 text-blue-600" aria-hidden="true" />
          <span>{t("country")}</span>
        </label>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => updateParams({ country: null, page: null })}
            className={cn(
              "flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer",
              !country
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60"
                : "bg-card border-border hover:bg-muted text-foreground"
            )}
          >
            {t("allCountries")}
          </button>
          <button
            type="button"
            onClick={() => updateParams({ country: "UKRAINE", page: null })}
            className={cn(
              "flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer",
              country === "UKRAINE"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60"
                : "bg-card border-border hover:bg-muted text-foreground"
            )}
          >
            {t("ukraine")}
          </button>
        </div>
      </div>
    </div>
  )
}
