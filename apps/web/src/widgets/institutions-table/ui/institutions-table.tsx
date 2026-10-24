"use client"

import { useTranslations } from "next-intl"
import {
  Building2,
  FileSpreadsheet,
  ChevronRight,
  X,
  SearchX,
  Globe,
} from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"
import { DataPagination } from "@workspace/ui/components/pagination"
import { useInstitutionSearchParams } from "@/src/features/institution-search"
import { useInstitutionsSearch } from "@/src/entities/institution"
import type { InstitutionSortOption } from "@/src/entities/institution"

interface ActivePill {
  id: string
  label: string
  onRemove: () => void
}

export function InstitutionsTable() {
  const t = useTranslations("institutionsPage")
  const {
    q,
    indexFrom,
    indexTo,
    country,
    sortOption,
    page,
    payload,
    updateParams,
    clearAll,
  } = useInstitutionSearchParams()

  const { institutions, totalElements, totalPages, isLoading, isFetching } =
    useInstitutionsSearch(payload)

  const pills: ActivePill[] = []

  if (q) {
    pills.push({
      id: "q",
      label: `"${q}"`,
      onRemove: () => updateParams({ q: null, page: null }),
    })
  }

  if (indexFrom !== undefined && indexTo !== undefined) {
    pills.push({
      id: "index-range",
      label: `${t("academicIndex")}: ${indexFrom}–${indexTo}`,
      onRemove: () => updateParams({ from: null, to: null, page: null }),
    })
  } else if (indexFrom !== undefined) {
    pills.push({
      id: "index-from",
      label: `${t("academicIndex")} ≥ ${indexFrom}`,
      onRemove: () => updateParams({ from: null, page: null }),
    })
  } else if (indexTo !== undefined) {
    pills.push({
      id: "index-to",
      label: `${t("academicIndex")} ≤ ${indexTo}`,
      onRemove: () => updateParams({ to: null, page: null }),
    })
  }

  if (country) {
    pills.push({
      id: "country",
      label: country === "UKRAINE" ? t("ukraine") : country,
      onRemove: () => updateParams({ country: null, page: null }),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-base font-bold text-foreground flex items-center gap-2">
            <Building2 className="size-4 text-blue-600" aria-hidden="true" />
            {t("title")}
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
            {t("foundTotal", { count: totalElements })}
          </span>
          {isFetching && (
            <span className="size-2 rounded-full bg-blue-600 animate-ping" aria-hidden="true" />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium">{t("sorting")}</span>
            <Select
              selectedKey={sortOption}
              onSelectionChange={(key) =>
                updateParams({
                  sort: key as InstitutionSortOption,
                  page: null,
                })
              }
              aria-label={t("sorting")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="INDEX_DESC">{t("sortIndexDesc")}</SelectItem>
                <SelectItem id="NAME_ASC">{t("sortNameAsc")}</SelectItem>
                <SelectItem id="AUTHORS_DESC">{t("sortAuthorsDesc")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <a
            href="/api/institutions/download/excel"
            download="institutions.xlsx"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95 group shrink-0"
          >
            <FileSpreadsheet
              className="size-3.5 text-emerald-600 group-hover:scale-110 transition-transform"
              aria-hidden="true"
            />
            <span>{t("downloadExcel")}</span>
          </a>
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
              <span className="line-clamp-1 max-w-[220px]">{pill.label}</span>
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
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-14 animate-pulse rounded-lg bg-muted/40"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : institutions.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center space-y-3 shadow-xs">
          <div className="flex justify-center text-muted-foreground">
            <SearchX className="size-10" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-foreground">{t("emptyTitle")}</h2>
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
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[580px]" aria-label={t("title")}>
              <thead>
                <tr className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th scope="col" className="py-3.5 pl-5 pr-4">{t("tableUAName")}</th>
                  <th scope="col" className="py-3.5 px-4 hidden md:table-cell">{t("tableENName")}</th>
                  <th scope="col" className="py-3.5 px-4">{t("tableCountry")}</th>
                  <th scope="col" className="py-3.5 px-4 text-right">{t("tableIndex")}</th>
                  <th scope="col" className="py-3.5 pr-5 pl-4 text-right w-24">{t("tableActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs font-medium">
                {institutions.map((inst) => {
                  const formattedIndex =
                    inst.academicIndex !== null
                      ? inst.academicIndex.toFixed(2).replace(".", ",")
                      : "—"

                  return (
                    <tr
                      key={inst.institutionId}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-4 pl-5 pr-4">
                        <Link
                          href={`/institutions/${inst.institutionId}`}
                          className="font-bold text-foreground hover:text-blue-600 hover:underline transition-colors block text-sm"
                        >
                          {inst.nameUA || "—"}
                        </Link>
                        {inst.nameEN && (
                          <span className="text-[11px] text-muted-foreground md:hidden block mt-0.5">
                            {inst.nameEN}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground hidden md:table-cell">
                        {inst.nameEN || "—"}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/70">
                          <Globe className="size-3 text-blue-600" aria-hidden="true" />
                          <span>{inst.country || "—"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-block font-mono font-extrabold text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 px-2.5 py-0.5 rounded-md text-xs">
                          {formattedIndex}
                        </span>
                      </td>
                      <td className="py-4 pr-5 pl-4 text-right">
                        <Link
                          href={`/institutions/${inst.institutionId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-blue-600 transition-colors"
                        >
                          <span>{t("viewDetails")}</span>
                          <ChevronRight className="size-3" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
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
