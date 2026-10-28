"use client"

import { useTranslations } from "next-intl"
import { FileText, X, FileX, AlertCircle, RotateCw } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"
import { DataPagination } from "@workspace/ui/components/pagination"
import { PublicationCard } from "./publication-card"
import { usePublicationSearchParams } from "@/src/features/publication-search/model/use-publication-search-params"
import { usePublicationsSearch, sortOptionSchema } from "@/src/entities/publication"

export function PublicationFeed() {
  const t = useTranslations("publicationsFeed")
  const {
    q,
    yearFrom,
    yearTo,
    selectedJournals,
    onlyWithCitations,
    onlyWithReferences,
    semanticMode,
    sortOption,
    page,
    payload,
    updateParams,
    toggleJournal,
    clearAll,
  } = usePublicationSearchParams()

  const {
    publications,
    totalElements,
    totalPages,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = usePublicationsSearch(payload)

  interface ActivePill {
    id: string
    label: string
    onRemove: () => void
  }

  const pills: ActivePill[] = []

  if (q) {
    pills.push({
      id: "q",
      label: `"${q}"`,
      onRemove: () => updateParams({ q: null, page: null }),
    })
  }

  if (yearFrom !== undefined && yearTo !== undefined) {
    pills.push({
      id: "year-range",
      label: `${yearFrom}–${yearTo}`,
      onRemove: () => updateParams({ from: null, to: null, page: null }),
    })
  } else if (yearFrom !== undefined) {
    pills.push({
      id: "year-from",
      label: `≥ ${yearFrom}`,
      onRemove: () => updateParams({ from: null, page: null }),
    })
  } else if (yearTo !== undefined) {
    pills.push({
      id: "year-to",
      label: `≤ ${yearTo}`,
      onRemove: () => updateParams({ to: null, page: null }),
    })
  }

  selectedJournals.forEach((journal) => {
    pills.push({
      id: `journal-${journal}`,
      label: journal,
      onRemove: () => toggleJournal(journal),
    })
  })

  if (onlyWithCitations) {
    pills.push({
      id: "citations",
      label: t("onlyWithCitations"),
      onRemove: () => updateParams({ citations: null, page: null }),
    })
  }

  if (onlyWithReferences) {
    pills.push({
      id: "refs",
      label: t("onlyWithReferences"),
      onRemove: () => updateParams({ refs: null, page: null }),
    })
  }

  if (semanticMode) {
    pills.push({
      id: "semantic",
      label: t("semanticSearch"),
      onRemove: () => updateParams({ semantic: null, page: null }),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="size-8 rounded-xl bg-brand-subtle border border-brand-border flex items-center justify-center text-brand-text shadow-2xs shrink-0">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {t("recentTitle")}
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-subtle text-brand-subtle-foreground border border-brand-border shadow-2xs">
            {t("foundTotal", { count: totalElements })}
          </span>
          {isFetching && (
            <span className="size-2 rounded-full bg-brand animate-ping" aria-hidden="true" />
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-card/95 dark:bg-card/85 backdrop-blur-md border border-border/80 rounded-xl px-3 py-1 shadow-2xs text-xs">
            <span className="text-muted-foreground font-medium shrink-0">{t("sorting")}</span>
            <Select
              selectedKey={sortOption}
              onSelectionChange={(key) => {
                const parsed = sortOptionSchema.safeParse(key)
                if (parsed.success) {
                  updateParams({ sort: parsed.data, page: null })
                }
              }}
              aria-label={t("sorting")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="DATE_DESC">{t("sortNewest")}</SelectItem>
                <SelectItem id="CITATIONS_DESC">{t("sortCitations")}</SelectItem>
                <SelectItem id="REFERENCES_DESC">{t("sortReferences")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {pills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
          <span className="text-xs text-muted-foreground font-medium">
            {t("activeFilters")}
          </span>
          {pills.map((pill) => (
            <span
              key={pill.id}
              className="inline-flex items-center gap-1.5 bg-muted/40 dark:bg-muted/20 border border-border/70 text-foreground px-2.5 py-1 rounded-lg text-xs font-medium shadow-2xs"
            >
              <span className="line-clamp-1 max-w-[200px]">{pill.label}</span>
              <button
                type="button"
                onClick={pill.onRemove}
                className="text-muted-foreground/70 hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors cursor-pointer"
                aria-label={`Remove filter ${pill.label}`}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-brand-text hover:text-brand-text-hover font-semibold ml-1 cursor-pointer transition-colors hover:underline"
          >
            {t("clearAll")}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-32 animate-pulse rounded-xl sm:rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2.5"
              aria-hidden="true"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-muted/70 rounded-md" />
                <div className="h-3 w-16 bg-muted/60 rounded-md" />
              </div>
              <div className="h-5 w-4/5 bg-muted/70 rounded-md" />
              <div className="h-3.5 w-1/2 bg-muted/60 rounded-md" />
              <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                <div className="h-4 w-36 bg-muted/70 rounded-md" />
                <div className="h-4 w-28 bg-muted/70 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-xl sm:rounded-2xl border border-destructive/30 p-8 text-center space-y-3 shadow-xs">
          <div className="flex justify-center text-destructive">
            <AlertCircle className="size-9" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Помилка завантаження публікацій
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Не вдалося отримати дані з сервера. Перевірте зʼєднання або спробуйте знову.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer active:scale-95"
          >
            <RotateCw className="size-3.5" aria-hidden="true" />
            <span>Спробувати знову</span>
          </button>
        </div>
      ) : publications.length === 0 ? (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-xl sm:rounded-2xl border border-border/80 p-8 text-center space-y-3 shadow-xs">
          <div className="flex justify-center text-muted-foreground">
            <FileX className="size-9" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {t("emptyTitle")}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {t("emptyDesc")}
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer active:scale-95"
          >
            {t("resetFilters")}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {publications.map((pub) => (
            <PublicationCard key={pub.doi} publication={pub} />
          ))}
        </div>
      )}

      <DataPagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageLabel={t("page")}
        ofLabel={t("of")}
        onPageChange={(nextPage) => updateParams({ page: nextPage })}
      />
    </div>
  )
}
