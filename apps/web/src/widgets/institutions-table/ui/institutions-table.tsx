"use client"

import { useTranslations } from "next-intl"
import {
  Building2,
  ChevronRight,
  X,
  SearchX,
  Globe,
  AlertCircle,
  RotateCw,
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
import { ExcelDownloadButton } from "@/src/features/export-excel"
import { useInstitutionSearchParams } from "@/src/features/institution-search"
import { useInstitutionsSearch, institutionSortOptionSchema } from "@/src/entities/institution"

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

  const {
    institutions,
    totalElements,
    totalPages,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useInstitutionsSearch(payload)

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="size-8 rounded-xl bg-brand-subtle border border-brand-border flex items-center justify-center text-brand-text shadow-2xs shrink-0">
            <Building2 className="size-4" aria-hidden="true" />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {t("title")}
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-subtle text-brand-subtle-foreground border border-brand-border shadow-2xs">
            {t("foundTotal", { count: totalElements })}
          </span>
          {isFetching && (
            <span className="size-2 rounded-full bg-brand animate-ping" aria-hidden="true" />
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline text-muted-foreground font-medium shrink-0">{t("sorting")}</span>
            <Select
              selectedKey={sortOption}
              onSelectionChange={(key) => {
                const parsed = institutionSortOptionSchema.safeParse(key)
                if (parsed.success) {
                  updateParams({
                    sort: parsed.data,
                    page: null,
                  })
                }
              }}
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

          <ExcelDownloadButton
            endpoint="/api/institutions/download/excel"
            filename="institutions.xlsx"
            fallbackData={() => {
              const header = "#;Назва установи;Країна;Академічний індекс\n"
              const rows = institutions
                .map((inst, i) => `${i + 1};${inst.nameUA || inst.nameEN || ""};${inst.country || ""};${inst.academicIndex ?? ""}`)
                .join("\n")
              return `\uFEFF${header}${rows}`
            }}
          />
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
              <span className="line-clamp-1 max-w-[220px]">{pill.label}</span>
              <button
                type="button"
                onClick={pill.onRemove}
                className="hover:text-foreground text-muted-foreground cursor-pointer"
                aria-label={`Remove filter ${pill.label}`}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-brand-text hover:text-brand-text-hover font-semibold ml-1 cursor-pointer hover:underline"
          >
            {t("clearAll")}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 shadow-xs overflow-hidden p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-14 animate-pulse rounded-lg bg-muted/40"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-destructive/30 p-12 text-center space-y-3 shadow-xs">
          <div className="flex justify-center text-destructive">
            <AlertCircle className="size-10" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-foreground">
            Помилка завантаження установ
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Не вдалося отримати список інституцій. Перевірте зʼєднання або спробуйте знову.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand-hover transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCw className="size-3.5" aria-hidden="true" />
            <span>Спробувати знову</span>
          </button>
        </div>
      ) : institutions.length === 0 ? (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-12 text-center space-y-3 shadow-xs">
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
            className="inline-flex items-center px-4 py-2 rounded-xl bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand-hover transition-colors shadow-2xs cursor-pointer"
          >
            {t("resetFilters")}
          </button>
        </div>
      ) : (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[580px]" aria-label={t("title")}>
              <thead>
                <tr className="bg-well border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
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
                          className="font-bold text-foreground hover:text-brand-text hover:underline transition-colors block text-sm"
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
                        <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-foreground bg-well px-2 py-0.5 rounded-md border border-well-border">
                          <Globe className="size-3 text-brand-text" aria-hidden="true" />
                          <span>{inst.country || "—"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-block font-mono font-extrabold text-brand-subtle-foreground bg-brand-subtle border border-brand-border px-2.5 py-0.5 rounded-md text-xs shadow-2xs">
                          {formattedIndex}
                        </span>
                      </td>
                      <td className="py-4 pr-5 pl-4 text-right">
                        <Link
                          href={`/institutions/${inst.institutionId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-brand-text transition-colors"
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
