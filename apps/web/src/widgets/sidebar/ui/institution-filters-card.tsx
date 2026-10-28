"use client"

import { useTranslations } from "next-intl"
import { SlidersHorizontal, TrendingUp, Globe } from "lucide-react"
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
    <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-3.5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
          <SlidersHorizontal className="size-3.5 text-brand-text" aria-hidden="true" />
          <span>{t("filterTitle")}</span>
        </span>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-brand-text hover:text-brand-text-hover font-semibold transition-colors cursor-pointer hover:underline"
        >
          {tCommon("reset")}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <TrendingUp className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span>{t("academicIndex")}</span>
        </label>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-well border border-well-border">
          <button
            type="button"
            onClick={() => updateParams({ from: null, to: null, page: null })}
            className={cn(
              "flex-1 py-1 text-xs rounded-lg transition-all text-center cursor-pointer select-none",
              isAll
                ? "bg-brand text-brand-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
            )}
          >
            {tCommon("allInstitutions")}
          </button>
          <button
            type="button"
            onClick={() => updateParams({ from: 10, to: null, page: null })}
            className={cn(
              "flex-1 py-1 text-xs rounded-lg transition-all text-center cursor-pointer select-none font-mono",
              isGt10
                ? "bg-brand text-brand-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
            )}
          >
            &gt; 10
          </button>
          <button
            type="button"
            onClick={() => updateParams({ from: 15, to: null, page: null })}
            className={cn(
              "flex-1 py-1 text-xs rounded-lg transition-all text-center cursor-pointer select-none font-mono",
              isGt15
                ? "bg-brand text-brand-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
            )}
          >
            &gt; 15
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-[10px] text-muted-foreground font-mono select-none">
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
              className="w-full h-7 pl-7 pr-2 text-xs font-mono rounded-lg border border-well-border text-foreground placeholder:text-muted-foreground/60 bg-well focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-[10px] text-muted-foreground font-mono select-none">
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
              className="w-full h-7 pl-7 pr-2 text-xs font-mono rounded-lg border border-well-border text-foreground placeholder:text-muted-foreground/60 bg-well focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
            />
          </div>
        </div>
      </div>

      <hr className="border-border/50" />

      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Globe className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span>{t("country")}</span>
        </label>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-well border border-well-border">
          <button
            type="button"
            onClick={() => updateParams({ country: null, page: null })}
            className={cn(
              "flex-1 py-1 text-xs rounded-lg transition-all text-center cursor-pointer select-none",
              !country
                ? "bg-brand text-brand-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
            )}
          >
            {t("allCountries")}
          </button>
          <button
            type="button"
            onClick={() => updateParams({ country: "UKRAINE", page: null })}
            className={cn(
              "flex-1 py-1 text-xs rounded-lg transition-all text-center cursor-pointer select-none",
              country === "UKRAINE"
                ? "bg-brand text-brand-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
            )}
          >
            {t("ukraine")}
          </button>
        </div>
      </div>
    </div>
  )
}
