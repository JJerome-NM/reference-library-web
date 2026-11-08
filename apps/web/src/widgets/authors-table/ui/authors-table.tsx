"use client"

import { useTranslations } from "next-intl"
import {
  Users,
  ChevronRight,
  ExternalLink,
  X,
  UserX,
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
import { useAuthorSearchParams } from "@/src/features/author-search"
import { useAuthorsSearch, authorSortOptionSchema } from "@/src/entities/author"

function OrcidIcon() {
  return (
    <svg className="size-3.5 fill-[#A6CE39] shrink-0" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0ZM86.35,186.29H67.11V79.71H86.35Zm-9.62-120a11.19,11.19,0,1,1,11.19-11.19A11.19,11.19,0,0,1,76.73,66.29ZM197.89,141a38.41,38.41,0,0,1-13.43,29.93c-9.52,8.34-22.78,12.56-39.77,12.56H111.41V79.71h35.83c16.14,0,28.84,4.28,38.09,12.84A41,41,0,0,1,197.89,141Zm-20.1,0a24.16,24.16,0,0,0-7-18.08c-4.66-4.52-11.39-6.81-20.19-6.81h-19.1v49.8h19.1c9,0,15.82-2.35,20.45-7.05A24.47,24.47,0,0,0,177.79,141Z" />
    </svg>
  )
}

function getRankBadge(rank: number | null) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono font-extrabold text-[11px] shadow-2xs">
        1
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center size-6 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/30 font-mono font-extrabold text-[11px] shadow-2xs">
        2
      </span>
    )
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-700/10 text-amber-700 dark:text-amber-300 border border-amber-600/30 font-mono font-extrabold text-[11px] shadow-2xs">
        3
      </span>
    )
  }
  return (
    <span className="font-mono text-muted-foreground text-xs font-semibold">
      {rank ?? "—"}
    </span>
  )
}

interface ActivePill {
  id: string
  label: string
  onRemove: () => void
}

export function AuthorsTable() {
  const t = useTranslations("authorsPage")
  const {
    q,
    indexFrom,
    indexTo,
    onlyOrcid,
    onlyActivePubs,
    sortOption,
    page,
    payload,
    updateParams,
    clearAll,
  } = useAuthorSearchParams()

  const {
    authors,
    totalElements,
    totalPages,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAuthorsSearch(payload)

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

  if (onlyOrcid) {
    pills.push({
      id: "orcid",
      label: t("onlyWithOrcid"),
      onRemove: () => updateParams({ orcid: null, page: null }),
    })
  }

  if (onlyActivePubs) {
    pills.push({
      id: "activePubs",
      label: t("withActivePubs"),
      onRemove: () => updateParams({ activePubs: null, page: null }),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="size-8 rounded-xl bg-brand-subtle border border-brand-border flex items-center justify-center text-brand-text shadow-2xs shrink-0">
            <Users className="size-4" aria-hidden="true" />
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
                const parsed = authorSortOptionSchema.safeParse(key)
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
                <SelectItem id="RATING_ASC">{t("sortRatingAsc")}</SelectItem>
                <SelectItem id="NAME_ASC">{t("sortNameAsc")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ExcelDownloadButton
            endpoint="/api/authors/download/excel"
            filename="authors.xlsx"
            fallbackData={() => {
              const header = "#;Науковець;ORCID;Академічний індекс\n"
              const rows = authors
                .map((a, i) => `${i + 1};${a.lastName ?? ""} ${a.firstName ?? ""};${a.orcid};${a.academicIndex ?? ""}`)
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
              <span className="line-clamp-1 max-w-[200px]">{pill.label}</span>
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
              className="h-10 animate-pulse rounded-lg bg-muted/40"
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
            Помилка завантаження авторів
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Не вдалося отримати список дослідників. Перевірте зʼєднання або спробуйте знову.
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
      ) : authors.length === 0 ? (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-12 text-center space-y-3 shadow-xs">
          <div className="flex justify-center text-muted-foreground">
            <UserX className="size-10" aria-hidden="true" />
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
                  <th scope="col" className="py-3.5 pl-5 pr-3 w-16 text-center">{t("tableRank")}</th>
                  <th scope="col" className="py-3.5 px-4">{t("tableResearcher")}</th>
                  <th scope="col" className="py-3.5 px-4">{t("tableOrcid")}</th>
                  <th scope="col" className="py-3.5 px-4 text-right">{t("tableIndex")}</th>
                  <th scope="col" className="py-3.5 pr-5 pl-4 text-right w-24">{t("tableActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs font-medium">
                {authors.map((author, idx) => {
                  const rank = author.numberInRating ?? idx + 1
                  const fullName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
                  const orcidPure = author.orcid.replace("https://orcid.org/", "")
                  const formattedIndex =
                    author.academicIndex !== null
                      ? author.academicIndex.toFixed(2).replace(".", ",")
                      : "—"

                  return (
                    <tr
                      key={author.orcid}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3.5 pl-5 pr-3 text-center">
                        {getRankBadge(rank)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/authors/${orcidPure}/details`}
                          className="font-bold text-foreground hover:text-brand-text hover:underline transition-colors block text-sm"
                        >
                          {fullName}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={author.orcid}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground bg-well hover:bg-muted/50 px-2 py-1 rounded-md border border-well-border transition-colors"
                        >
                          <OrcidIcon />
                          <span>{orcidPure}</span>
                          <ExternalLink className="size-2.5 text-muted-foreground" aria-hidden="true" />
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-block font-mono font-extrabold text-brand-subtle-foreground bg-brand-subtle border border-brand-border px-2.5 py-0.5 rounded-md text-xs shadow-2xs">
                          {formattedIndex}
                        </span>
                      </td>
                      <td className="py-3.5 pr-5 pl-4 text-right">
                        <Link
                          href={`/authors/${orcidPure}/details`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-brand-text transition-colors"
                        >
                          <span>{t("profile")}</span>
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
