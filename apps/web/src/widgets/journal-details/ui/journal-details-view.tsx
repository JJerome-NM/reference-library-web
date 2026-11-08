"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Users,
  Award,
  TrendingUp,
  ExternalLink,
  Calendar,
  Search,
  Copy,
  Check,
  FileText,
  Info,
  Share2,
  LayoutGrid,
  List,
  Sparkles,
  Globe,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import { DateRangePicker } from "@/src/shared/ui/date-range-picker"
import { TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"
import { ExcelDownloadButton } from "@/src/features/export-excel"
import { sanitizeString } from "@/src/shared/lib/sanitizer"
import { cn } from "@workspace/ui/lib/utils"
import type { JournalDetailsResponse } from "@/src/entities/journal"

interface JournalDetailsViewProps {
  data: JournalDetailsResponse
}

type TabType = "issues" | "authors" | "about"
type ViewMode = "grid" | "list"
type IssueSort = "DATE_DESC" | "DATE_ASC" | "NUM_DESC"
type AuthorSort = "INDEX_DESC" | "NAME_ASC"

function OrcidIcon() {
  return (
    <svg className="size-3.5 fill-[#A6CE39] shrink-0" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0ZM86.35,186.29H67.11V79.71H86.35Zm-9.62-120a11.19,11.19,0,1,1,11.19-11.19A11.19,11.19,0,0,1,76.73,66.29ZM197.89,141a38.41,38.41,0,0,1-13.43,29.93c-9.52,8.34-22.78,12.56-39.77,12.56H111.41V79.71h35.83c16.14,0,28.84,4.28,38.09,12.84A41,41,0,0,1,197.89,141Zm-20.1,0a24.16,24.16,0,0,0-7-18.08c-4.66-4.52-11.39-6.81-20.19-6.81h-19.1v49.8h19.1c9,0,15.82-2.35,20.45-7.05A24.47,24.47,0,0,0,177.79,141Z" />
    </svg>
  )
}

export function JournalDetailsView({ data }: JournalDetailsViewProps) {
  const t = useTranslations("journalsPage")
  const { journal, academicIndex } = data

  const [activeTab, setActiveTab] = useState<TabType>("issues")
  const [issueSearch, setIssueSearch] = useState("")
  const [dateFrom, setDateFrom] = useState<string | null>(null)
  const [dateTo, setDateTo] = useState<string | null>(null)

  const [issueSort, setIssueSort] = useState<IssueSort>("DATE_DESC")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [authorSearch, setAuthorSearch] = useState("")
  const [authorSort, setAuthorSort] = useState<AuthorSort>("INDEX_DESC")
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [shared, setShared] = useState(false)

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  const { minYear, maxYear, hasMultipleYears } = useMemo(() => {
    const years = new Set<number>()
    for (const v of journal.journalVersions) {
      if (v.publishedDate && v.publishedDate.length >= 4) {
        const yr = parseInt(v.publishedDate.slice(0, 4), 10)
        if (!isNaN(yr)) years.add(yr)
      }
    }
    const sorted = Array.from(years).sort((a, b) => a - b)
    const min = sorted.length > 0 ? sorted[0]! : new Date().getFullYear()
    const max = sorted.length > 0 ? sorted[sorted.length - 1]! : new Date().getFullYear()
    return {
      minYear: min,
      maxYear: max,
      hasMultipleYears: max > min,
    }
  }, [journal.journalVersions])

  const issueDates = useMemo(() => {
    return journal.journalVersions
      .map((v) => v.publishedDate)
      .filter((d): d is string => typeof d === "string" && d.length === 10)
  }, [journal.journalVersions])

  const isDateFiltered = dateFrom !== null || dateTo !== null
  const isAllYearsActive = !isDateFiltered
  const isLastYearActive =
    dateFrom === `${maxYear}-01-01` && dateTo === `${maxYear}-12-31`
  const isThreeYearsActive =
    dateFrom === `${Math.max(minYear, maxYear - 2)}-01-01` &&
    dateTo === `${maxYear}-12-31`

  const latestVersionDoi = useMemo(() => {
    if (journal.journalVersions.length === 0) return null
    const sorted = [...journal.journalVersions].sort((a, b) => {
      if (a.versionNumber !== null && b.versionNumber !== null) {
        return b.versionNumber - a.versionNumber
      }
      return (b.publishedDate ?? "").localeCompare(a.publishedDate ?? "")
    })
    return sorted[0]?.doi ?? null
  }, [journal.journalVersions])

  const filteredVersions = useMemo(() => {
    let list = [...journal.journalVersions]
    const q = issueSearch.trim().toLowerCase()
    if (q) {
      list = list.filter((v) => {
        const matchNum = String(v.versionNumber ?? "").includes(q)
        const matchDoi = (v.doi ?? "").toLowerCase().includes(q)
        const matchDate = (v.publishedDate ?? "").toLowerCase().includes(q)
        return matchNum || matchDoi || matchDate
      })
    }
    if (dateFrom) {
      list = list.filter((v) => !v.publishedDate || v.publishedDate >= dateFrom)
    }
    if (dateTo) {
      list = list.filter((v) => !v.publishedDate || v.publishedDate <= dateTo)
    }
    if (issueSort === "DATE_ASC") {
      list.sort((a, b) => (a.publishedDate ?? "").localeCompare(b.publishedDate ?? ""))
    } else if (issueSort === "NUM_DESC") {
      list.sort((a, b) => (b.versionNumber ?? 0) - (a.versionNumber ?? 0))
    } else {
      list.sort((a, b) => {
        if (a.publishedDate && b.publishedDate && a.publishedDate !== b.publishedDate) {
          return b.publishedDate.localeCompare(a.publishedDate)
        }
        return (b.versionNumber ?? 0) - (a.versionNumber ?? 0)
      })
    }
    return list
  }, [journal.journalVersions, issueSearch, dateFrom, dateTo, issueSort])

  const filteredAuthors = useMemo(() => {
    let list = [...journal.authors]
    const q = authorSearch.trim().toLowerCase()
    if (q) {
      list = list.filter((a) => {
        const fullName = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase()
        const orcid = (a.orcid ?? "").toLowerCase()
        return fullName.includes(q) || orcid.includes(q)
      })
    }
    if (authorSort === "NAME_ASC") {
      list.sort((a, b) => (a.lastName ?? "").localeCompare(b.lastName ?? ""))
    } else {
      list.sort((a, b) => (b.academicIndex ?? 0) - (a.academicIndex ?? 0))
    }
    return list
  }, [journal.authors, authorSearch, authorSort])

  const formattedIndex =
    academicIndex !== null ? academicIndex.toFixed(1).replace(".", ",") : "—"

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/journals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-text transition-colors group cursor-pointer"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span>{t("backToJournals")}</span>
        </Link>
      </div>

      <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-subtle text-brand-text border border-brand-border shadow-2xs">
                <BookOpen className="size-5" aria-hidden="true" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("journalDetails")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs">
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>{t("verifiedJournal")}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-well text-muted-foreground border border-well-border shadow-2xs">
                <Globe className="size-3 text-brand-text" aria-hidden="true" />
                <span>CrossRef DOI</span>
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight leading-snug">
            {journal.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {journal.printIssn && (
                <div className="inline-flex items-center gap-1.5 bg-well text-foreground px-2.5 py-1 rounded-lg border border-well-border font-mono text-[11px] whitespace-nowrap shadow-2xs">
                  <span className="text-muted-foreground font-sans font-bold text-[10px]">
                    {t("printIssn")}:
                  </span>
                  <span>{journal.printIssn}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(journal.printIssn!, "pissn")}
                    className="hover:text-brand-text text-muted-foreground cursor-pointer transition-colors"
                    aria-label="Copy print ISSN"
                  >
                    {copiedField === "pissn" ? (
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}

              {journal.onlineIssn && (
                <div className="inline-flex items-center gap-1.5 bg-brand-subtle text-brand-subtle-foreground px-2.5 py-1 rounded-lg border border-brand-border font-mono text-[11px] whitespace-nowrap shadow-2xs">
                  <span className="text-brand-text font-sans font-bold text-[10px]">
                    {t("onlineIssn")}:
                  </span>
                  <span>{journal.onlineIssn}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(journal.onlineIssn!, "eissn")}
                    className="hover:text-brand-text-hover text-brand-text cursor-pointer transition-colors"
                    aria-label="Copy online ISSN"
                  >
                    {copiedField === "eissn" ? (
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 h-8 min-h-8 max-h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer select-none"
              >
                {shared ? (
                  <>
                    <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t("shared")}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-3.5 text-brand-text" aria-hidden="true" />
                    <span>{t("share")}</span>
                  </>
                )}
              </button>

              <Link
                href={`/publications?journals=${encodeURIComponent(journal.title ?? "")}`}
                className="inline-flex items-center gap-1.5 h-8 min-h-8 max-h-8 px-3 rounded-lg border border-brand-border bg-brand-subtle hover:bg-brand-subtle/80 text-brand-subtle-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95"
              >
                <FileText className="size-3.5 text-brand-text shrink-0" aria-hidden="true" />
                <span>{t("allJournalArticles")}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-brand-subtle border border-brand-border text-center shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-tight text-brand-subtle-foreground flex items-center justify-center gap-1">
              <Award className="size-3 text-brand-text shrink-0" aria-hidden="true" />
              {t("academicIndex")}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-brand-subtle-foreground font-mono tracking-tight block mt-1">
              {formattedIndex}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border text-center shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground flex items-center justify-center gap-1">
              <Layers className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
              {t("versionsCount", { count: "" }).trim()}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight block mt-1">
              {journal.versionsCount ?? journal.journalVersions.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border text-center shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground flex items-center justify-center gap-1">
              <Users className="size-3 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
              {t("authorsCount", { count: "" }).trim()}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight block mt-1">
              {journal.authorsCount ?? journal.authors.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border text-center shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground flex items-center justify-center gap-1">
              <TrendingUp className="size-3 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
              {t("impactFactor")}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight block mt-1">
              {journal.impactFactor ?? "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <TabsList>
          <TabsTrigger
            isActive={activeTab === "issues"}
            onClick={() => setActiveTab("issues")}
          >
            <Layers className="size-3.5" aria-hidden="true" />
            <span>{t("issues")}</span>
            <span className="ml-1 text-[10px] font-mono opacity-80">
              ({journal.journalVersions.length})
            </span>
          </TabsTrigger>

          <TabsTrigger
            isActive={activeTab === "authors"}
            onClick={() => setActiveTab("authors")}
          >
            <Users className="size-3.5" aria-hidden="true" />
            <span>{t("authors")}</span>
            <span className="ml-1 text-[10px] font-mono opacity-80">
              ({journal.authors.length})
            </span>
          </TabsTrigger>

          <TabsTrigger
            isActive={activeTab === "about"}
            onClick={() => setActiveTab("about")}
          >
            <Info className="size-3.5" aria-hidden="true" />
            <span>{t("about")}</span>
          </TabsTrigger>
        </TabsList>

        {activeTab === "issues" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-md p-2.5 sm:p-3.5 shadow-xs transition-all duration-200 relative z-20">
              <div className="relative flex items-center gap-2.5 px-2 py-1">
                <Search className="size-5 text-muted-foreground transition-colors shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder={t("searchIssuesPlaceholder")}
                  value={issueSearch}
                  onChange={(e) => setIssueSearch(sanitizeString(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") e.currentTarget.blur()
                  }}
                  className="flex-1 bg-transparent text-sm sm:text-base font-normal text-foreground placeholder:text-muted-foreground/70 outline-none border-0 min-w-0"
                />
                {issueSearch.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIssueSearch("")}
                    aria-label={t("clearSearch")}
                    className="p-1 rounded-full text-muted-foreground/70 hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer select-none shrink-0"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-xl bg-well border border-well-border relative z-20">
                <div className="flex flex-wrap items-center gap-1.5">
                  <DateRangePicker
                    startDate={dateFrom}
                    endDate={dateTo}
                    onChange={(from, to) => {
                      setDateFrom(from)
                      setDateTo(to)
                    }}
                    minDate={journal.journalVersions.length > 0 ? `${minYear}-01-01` : undefined}
                    maxDate={journal.journalVersions.length > 0 ? `${maxYear}-12-31` : undefined}
                    issueDates={issueDates}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setDateFrom(null)
                      setDateTo(null)
                    }}
                    className={cn(
                      "h-8 min-h-8 max-h-8 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none shadow-2xs border",
                      isAllYearsActive
                        ? "bg-brand text-brand-foreground border-brand"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {t("allYears")}
                  </button>

                  {hasMultipleYears && (
                    <button
                      type="button"
                      onClick={() => {
                        setDateFrom(`${Math.max(minYear, maxYear - 2)}-01-01`)
                        setDateTo(`${maxYear}-12-31`)
                      }}
                      className={cn(
                        "h-8 min-h-8 max-h-8 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none shadow-2xs border",
                        isThreeYearsActive
                          ? "bg-brand text-brand-foreground border-brand"
                          : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {t("last3Years")}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setDateFrom(`${maxYear}-01-01`)
                      setDateTo(`${maxYear}-12-31`)
                    }}
                    className={cn(
                      "h-8 min-h-8 max-h-8 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none shadow-2xs border",
                      isLastYearActive
                        ? "bg-brand text-brand-foreground border-brand"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {t("lastYear")}
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Select
                    selectedKey={issueSort}
                    onSelectionChange={(key) => setIssueSort(key as IssueSort)}
                    aria-label={t("sorting")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem id="DATE_DESC">{t("sortDateDesc")}</SelectItem>
                      <SelectItem id="DATE_ASC">{t("sortDateAsc")}</SelectItem>
                      <SelectItem id="NUM_DESC">{t("sortNumberDesc")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center border border-border rounded-lg bg-card p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "size-7 rounded-md flex items-center justify-center transition-colors cursor-pointer",
                        viewMode === "grid"
                          ? "bg-brand-subtle text-brand-subtle-foreground font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-label={t("grid")}
                    >
                      <LayoutGrid className="size-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "size-7 rounded-md flex items-center justify-center transition-colors cursor-pointer",
                        viewMode === "list"
                          ? "bg-brand-subtle text-brand-subtle-foreground font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-label={t("list")}
                    >
                      <List className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <ExcelDownloadButton
                    endpoint={`/api/journals/${journal.printIssn || journal.onlineIssn}/download/excel?type=issues`}
                    filename={`${(journal.title || "journal").replace(/[^a-zA-Zа-яА-Я0-9]/g, "_")}_issues.xlsx`}
                    fallbackData={() => {
                      const header = "#;Випуск;DOI;Дата публікації\n"
                      const rows = (filteredVersions ?? [])
                        .map((v, i) => `${i + 1};${v.versionNumber ?? ""};${v.doi ?? ""};${v.publishedDate ?? ""}`)
                        .join("\n")
                      return `\uFEFF${header}${rows}`
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {t("allIssues")}
                </span>
                <span className="font-mono font-bold text-brand-subtle-foreground bg-brand-subtle border border-brand-border px-2 py-0.5 rounded-full text-[11px] shadow-2xs">
                  {filteredVersions.length}
                </span>
              </div>

              {(issueSearch || isDateFiltered) && (
                <button
                  type="button"
                  onClick={() => {
                    setIssueSearch("")
                    setDateFrom(null)
                    setDateTo(null)
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="size-3" aria-hidden="true" />
                  <span>{t("resetFilters")}</span>
                </button>
              )}
            </div>

            {filteredVersions.length === 0 ? (
              <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-8 text-center space-y-3 shadow-xs">
                <Layers className="size-8 mx-auto text-muted-foreground/60" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">{t("noIssuesFound")}</p>
                  <p className="text-xs text-muted-foreground">{t("emptyDesc")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIssueSearch("")
                    setDateFrom(null)
                    setDateTo(null)
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-subtle text-brand-subtle-foreground border border-brand-border text-xs font-semibold hover:bg-brand-subtle/80 transition-all cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="size-3" aria-hidden="true" />
                  <span>{t("resetFilters")}</span>
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredVersions.map((version) => {
                  const isLatest = version.doi === latestVersionDoi
                  return (
                    <div
                      key={version.doi || version.versionNumber}
                      className={cn(
                        "bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-xl border p-4 shadow-2xs transition-all space-y-3 flex flex-col justify-between hover:border-brand-border hover:shadow-xs group",
                        isLatest ? "border-brand-border bg-brand-subtle/20" : "border-border/80"
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                            <Layers className="size-4 text-brand-text shrink-0" aria-hidden="true" />
                            <span>№ {version.versionNumber ?? "—"}</span>
                          </span>

                          {isLatest && (
                            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              {t("latestIssue")}
                            </span>
                          )}
                        </div>

                        {version.publishedDate && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Calendar className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                            <span>{version.publishedDate}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-well border border-well-border text-xs">
                          <a
                            href={`https://doi.org/${version.doi}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="font-mono text-[11px] text-brand-text hover:text-brand-text-hover hover:underline truncate"
                          >
                            {version.doi}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(version.doi, version.doi)}
                            className="size-5 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                            aria-label={t("copyDoi")}
                          >
                            {copiedField === version.doi ? (
                              <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            ) : (
                              <Copy className="size-3" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-end">
                        <Link
                          href={`/publications?journals=${encodeURIComponent(journal.title ?? "")}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-text hover:text-brand-text-hover transition-colors group-hover:translate-x-0.5"
                        >
                          <span>{t("viewIssueArticles")}</span>
                          <ChevronRight className="size-3" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredVersions.map((version) => {
                  const isLatest = version.doi === latestVersionDoi
                  return (
                    <div
                      key={version.doi || version.versionNumber}
                      className={cn(
                        "bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-xl border p-3.5 shadow-2xs hover:border-brand-border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                        isLatest ? "border-brand-border bg-brand-subtle/20" : "border-border/80"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-3 min-w-0">
                        <div className="flex items-center gap-2 shrink-0">
                          <Layers className="size-4 text-brand-text shrink-0" aria-hidden="true" />
                          <span className="font-extrabold text-xs text-foreground">
                            {t("issueNumber", { number: version.versionNumber ?? "—" })}
                          </span>
                          {isLatest && (
                            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              {t("latestIssue")}
                            </span>
                          )}
                        </div>

                        {version.publishedDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium shrink-0">
                            <Calendar className="size-3" aria-hidden="true" />
                            <span>{version.publishedDate}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-well border border-well-border min-w-0">
                          <span className="text-[10px] font-semibold text-muted-foreground">DOI:</span>
                          <a
                            href={`https://doi.org/${version.doi}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="font-mono text-xs text-brand-text hover:text-brand-text-hover hover:underline truncate"
                          >
                            {version.doi}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(version.doi, version.doi)}
                            className="size-4 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 cursor-pointer"
                            aria-label={t("copyDoi")}
                          >
                            {copiedField === version.doi ? (
                              <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            ) : (
                              <Copy className="size-3" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Link
                        href={`/publications?journals=${encodeURIComponent(journal.title ?? "")}`}
                        className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-brand-text hover:text-brand-text-hover shrink-0 self-end sm:self-center"
                      >
                        <span>{t("viewIssueArticles")}</span>
                        <ChevronRight className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "authors" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-md p-2.5 sm:p-3.5 shadow-xs transition-all duration-200">
              <div className="relative flex items-center gap-2.5 px-2 py-1">
                <Search className="size-5 text-muted-foreground transition-colors shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder={t("searchAuthors")}
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(sanitizeString(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") e.currentTarget.blur()
                  }}
                  className="flex-1 bg-transparent text-sm sm:text-base font-normal text-foreground placeholder:text-muted-foreground/70 outline-none border-0 min-w-0"
                />
                {authorSearch.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAuthorSearch("")}
                    aria-label={t("clearSearch")}
                    className="p-1 rounded-full text-muted-foreground/70 hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer select-none shrink-0"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-xl bg-well border border-well-border">
                <div className="flex items-center gap-2 px-1 text-xs">
                  <Users className="size-3.5 text-brand-text" aria-hidden="true" />
                  <span className="font-semibold text-muted-foreground uppercase text-[11px] tracking-wider select-none">
                    {t("authors")}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Select
                    selectedKey={authorSort}
                    onSelectionChange={(key) => setAuthorSort(key as AuthorSort)}
                    aria-label={t("sorting")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem id="INDEX_DESC">{t("sortAuthorsIndex")}</SelectItem>
                      <SelectItem id="NAME_ASC">{t("sortAuthorsName")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <ExcelDownloadButton
                    endpoint={`/api/journals/${journal.printIssn || journal.onlineIssn}/download/excel?type=authors`}
                    filename={`${(journal.title || "journal").replace(/[^a-zA-Zа-яА-Я0-9]/g, "_")}_authors.xlsx`}
                    fallbackData={() => {
                      const header = "#;Науковець;ORCID;Академічний індекс\n"
                      const rows = (filteredAuthors ?? [])
                        .map((a, i) => `${i + 1};${a.lastName ?? ""} ${a.firstName ?? ""};${a.orcid};${a.academicIndex ?? ""}`)
                        .join("\n")
                      return `\uFEFF${header}${rows}`
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {t("allAuthorsList")}
                </span>
                <span className="font-mono font-bold text-brand-subtle-foreground bg-brand-subtle border border-brand-border px-2 py-0.5 rounded-full text-[11px] shadow-2xs">
                  {filteredAuthors.length}
                </span>
              </div>

              {authorSearch && (
                <button
                  type="button"
                  onClick={() => setAuthorSearch("")}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="size-3" aria-hidden="true" />
                  <span>{t("resetFilters")}</span>
                </button>
              )}
            </div>

            {filteredAuthors.length === 0 ? (
              <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-8 text-center text-xs text-muted-foreground space-y-2">
                <Users className="size-8 mx-auto text-muted-foreground" aria-hidden="true" />
                <p>{t("noAuthorsFound")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAuthors.map((author, idx) => {
                  const fullName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
                  const orcidPure = author.orcid.replace("https://orcid.org/", "")
                  const formattedAuthIndex =
                    author.academicIndex !== null && author.academicIndex !== undefined
                      ? author.academicIndex.toFixed(2).replace(".", ",")
                      : "—"

                  return (
                    <div
                      key={author.orcid}
                      className="p-4 rounded-xl bg-card/95 dark:bg-card/85 backdrop-blur-md border border-border/80 hover:border-brand-border transition-all flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={cn(
                            "size-7 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 border",
                            idx === 0
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                              : idx === 1
                                ? "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30"
                                : idx === 2
                                  ? "bg-amber-700/10 text-amber-800 dark:text-amber-500 border-amber-700/30"
                                  : "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {idx + 1}
                        </span>

                        <div className="space-y-0.5 min-w-0">
                          <Link
                            href={`/authors/${orcidPure}/details`}
                            className="font-bold text-sm text-foreground hover:text-brand-text truncate block transition-colors"
                          >
                            {fullName || orcidPure}
                          </Link>
                          <a
                            href={author.orcid}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                          >
                            <OrcidIcon />
                            <span>{orcidPure}</span>
                            <ExternalLink className="size-2.5" aria-hidden="true" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-xs text-brand-subtle-foreground bg-brand-subtle border border-brand-border px-2 py-0.5 rounded-md shadow-2xs">
                          {formattedAuthIndex}
                        </span>
                        <Link
                          href={`/authors/${orcidPure}/details`}
                          className="size-7 rounded-lg border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={fullName}
                        >
                          <ChevronRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-4">
            <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-3 text-xs leading-relaxed text-muted-foreground">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-brand-text" aria-hidden="true" />
                <span>{t("metricOverview")}</span>
              </h2>
              <p>
                Видання «{journal.title}» індексується в національній наукометричній базі даних «Академічний Індекс». База забезпечує верифіковану оцінку цитованості наукових публікацій, прозорий облік випусків журналу та моніторинг академічних індексів авторів.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-card/95 dark:bg-card/85 border border-border/80 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                  <Globe className="size-4 text-brand-text" aria-hidden="true" />
                  <span>{t("standardsTitle")}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("standardsDesc")}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card/95 dark:bg-card/85 border border-border/80 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                  <BookOpen className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>{t("openAccessTitle")}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("openAccessDesc")}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card/95 dark:bg-card/85 border border-border/80 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                  <Award className="size-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span>{t("metricsTitle")}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("metricsDesc")}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-subtle border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-bold text-brand-subtle-foreground block">
                  {t("allJournalArticles")}
                </span>
                <span className="text-xs text-muted-foreground block">
                  Переглянути всі наукові статті та дослідження цього видання
                </span>
              </div>
              <Link
                href={`/publications?journals=${encodeURIComponent(journal.title ?? "")}`}
                className="inline-flex items-center gap-1.5 h-8 min-h-8 max-h-8 px-4 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-bold transition-all shadow-2xs shrink-0"
              >
                <FileText className="size-3.5" aria-hidden="true" />
                <span>{t("allJournalArticles")}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
