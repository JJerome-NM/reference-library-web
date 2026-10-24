"use client"

import { useTranslations } from "next-intl"
import { Clock, X, FileX } from "lucide-react"
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
import { usePublicationsSearch } from "@/src/entities/publication"
import type { SortOption } from "@/src/entities/publication"

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

  const { publications, totalElements, totalPages, isLoading, isFetching } =
    usePublicationsSearch(payload)

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
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-blue-600" aria-hidden="true" />
            {t("recentTitle")}
          </h2>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-xs text-muted-foreground font-medium">
            {t("foundTotal").replace("4 952", String(totalElements))}
          </span>
          {isFetching && (
            <span className="size-2 rounded-full bg-blue-600 animate-ping" aria-hidden="true" />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">{t("sorting")}</span>
          <Select
            selectedKey={sortOption}
            onSelectionChange={(key) => updateParams({ sort: key as SortOption, page: null })}
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

      {pills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
          <span className="text-[11px] text-muted-foreground font-medium">
            {t("activeFilters")}
          </span>
          {pills.map((pill) => (
            <span
              key={pill.id}
              className="inline-flex items-center gap-1 bg-card border border-border text-foreground px-2 py-0.5 rounded-md text-[11px] font-semibold shadow-2xs"
            >
              <span className="line-clamp-1 max-w-[200px]">{pill.label}</span>
              <button
                type="button"
                onClick={pill.onRemove}
                className="hover:text-foreground text-muted-foreground cursor-pointer"
                aria-label={`Remove filter ${pill.label}`}
              >
                <X className="size-2.5" aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold ml-1 cursor-pointer"
          >
            {t("clearAll")}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-44 animate-pulse rounded-2xl border border-border bg-muted/40 p-5"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : publications.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center space-y-3 shadow-xs">
          <div className="flex justify-center text-muted-foreground">
            <FileX className="size-10" aria-hidden="true" />
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
            className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
          >
            {t("resetFilters")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
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
