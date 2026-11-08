"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  Quote,
  Search,
  Share2,
  TrendingUp,
  UserCheck,
  Users,
  Download,
  Loader2,
  X,
} from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"
import { TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { ExcelDownloadButton } from "@/src/features/export-excel"
import { sanitizeString } from "@/src/shared/lib/sanitizer"
import type { AuthorDetailsResponse, AuthorDto } from "@/src/entities/author"
import type { FullPublicationDto } from "@/src/entities/publication"

interface AuthorDetailsViewProps {
  data: AuthorDetailsResponse
}

type TabType = "publications" | "coAuthors" | "journals" | "metrics"
type PublicationSortOption = "DATE_DESC" | "DATE_ASC" | "CITATIONS_DESC"

function isPublicationSortOption(key: unknown): key is PublicationSortOption {
  return key === "DATE_DESC" || key === "DATE_ASC" || key === "CITATIONS_DESC"
}

function OrcidIcon() {
  return (
    <svg className="size-3.5 fill-[#A6CE39] shrink-0" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0ZM86.35,186.29H67.11V79.71H86.35Zm-9.62-120a11.19,11.19,0,1,1,11.19-11.19A11.19,11.19,0,0,1,76.73,66.29ZM197.89,141a38.41,38.41,0,0,1-13.43,29.93c-9.52,8.34-22.78,12.56-39.77,12.56H111.41V79.71h35.83c16.14,0,28.84,4.28,38.09,12.84A41,41,0,0,1,197.89,141Zm-20.1,0a24.16,24.16,0,0,0-7-18.08c-4.66-4.52-11.39-6.81-20.19-6.81h-19.1v49.8h19.1c9,0,15.82-2.35,20.45-7.05A24.47,24.47,0,0,0,177.79,141Z" />
    </svg>
  )
}

export function AuthorDetailsView({ data }: AuthorDetailsViewProps) {
  const t = useTranslations("authorsPage")
  const { author, statistics, publications, importedJournalsCount } = data

  const [activeTab, setActiveTab] = useState<TabType>("publications")
  const [pubSearch, setPubSearch] = useState("")
  const [sortOption, setSortOption] = useState<PublicationSortOption>("DATE_DESC")
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [citePublication, setCitePublication] = useState<FullPublicationDto | null>(null)
  const [citationFormat, setCitationFormat] = useState<"dstu" | "apa" | "bibtex">("dstu")
  const [copiedCitation, setCopiedCitation] = useState(false)
  const [shared, setShared] = useState(false)
  const [bibtexStatus, setBibtexStatus] = useState<"idle" | "loading" | "success">("idle")

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

  function handleExportBibtex() {
    if (bibtexStatus !== "idle") return
    setBibtexStatus("loading")
    setTimeout(() => {
      const bibContent = (publications ?? [])
        .map((p, idx) => {
          const key = `article_${idx + 1}`
          const title = p.name ?? "Untitled"
          const year = p.publicationDate ? p.publicationDate.slice(0, 4) : "2024"
          const journal = p.journal?.title ?? ""
          const doi = p.doi ?? ""
          return `@article{${key},\n  title={${title}},\n  year={${year}},\n  journal={${journal}},\n  doi={${doi}}\n}`
        })
        .join("\n\n")

      const blob = new Blob([bibContent], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${author.lastName ?? "author"}_publications.bib`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setBibtexStatus("success")
      setTimeout(() => setBibtexStatus("idle"), 2000)
    }, 400)
  }

  const cleanOrcid = (author.orcid ?? "").replace("https://orcid.org/", "")
  const fullName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
  const initials = `${(author.firstName?.[0] ?? "").toUpperCase()}${(author.lastName?.[0] ?? "").toUpperCase()}` || "U"

  const formattedIndex =
    author.academicIndex !== null && author.academicIndex !== undefined
      ? author.academicIndex.toFixed(2).replace(".", ",")
      : "—"

  const totalPubCount = statistics?.totalPublications ?? publications?.length ?? 0
  const totalCitsCount = statistics?.totalCitationsPerAllPublications ?? 0
  const avgCitationsPerPub =
    totalPubCount > 0
      ? (totalCitsCount / totalPubCount).toFixed(2).replace(".", ",")
      : "0"

  const filteredPublications = useMemo(() => {
    let list = [...(publications ?? [])]
    const q = pubSearch.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          (p.name ?? "").toLowerCase().includes(q) || (p.doi ?? "").toLowerCase().includes(q)
      )
    }
    if (sortOption === "CITATIONS_DESC") {
      list.sort((a, b) => (b.totalCitations ?? 0) - (a.totalCitations ?? 0))
    } else if (sortOption === "DATE_ASC") {
      list.sort(
        (a, b) =>
          new Date(a.publicationDate ?? 0).getTime() -
          new Date(b.publicationDate ?? 0).getTime()
      )
    } else {
      list.sort(
        (a, b) =>
          new Date(b.publicationDate ?? 0).getTime() -
          new Date(a.publicationDate ?? 0).getTime()
      )
    }
    return list
  }, [publications, pubSearch, sortOption])

  const coAuthors = statistics?.coAuthors ?? []

  const uniqueJournals = useMemo(() => {
    const map = new Map<string, { title: string; issn: string; count: number }>()
    publications?.forEach((p) => {
      const title = p.journal?.title
      const issn = p.journal?.printIssn || p.journal?.onlineIssn || p.printIssn || p.onlineIssn
      if (title) {
        const key = issn || title
        const existing = map.get(key)
        if (existing) {
          existing.count += 1
        } else {
          map.set(key, { title, issn: issn || "", count: 1 })
        }
      }
    })
    return Array.from(map.values())
  }, [publications])

  function getCitationText(pub: FullPublicationDto, format: "dstu" | "apa" | "bibtex") {
    const authorsStr = (pub.authors || [])
      .map((a: AuthorDto) => `${a.lastName ?? ""} ${(a.firstName?.[0] ?? "").toUpperCase()}.`.trim())
      .filter(Boolean)
      .join(", ")
    const title = pub.name ?? "Без назви"
    const journalTitle = pub.journal?.title ?? ""
    const year = pub.publicationDate ? pub.publicationDate.slice(0, 4) : "2024"
    const doiClean = pub.doi.replace("https://doi.org/", "")

    if (format === "dstu") {
      return `${authorsStr ? `${authorsStr} ` : ""}${title}${journalTitle ? ` // ${journalTitle}` : ""}. ${year}. DOI: ${doiClean}`
    }
    if (format === "apa") {
      return `${authorsStr ? `${authorsStr} ` : ""}(${year}). ${title}.${journalTitle ? ` ${journalTitle}.` : ""} https://doi.org/${doiClean}`
    }
    const cleanKey = `ref_${doiClean.replace(/[^a-zA-Z0-9]/g, "_")}`
    return `@article{${cleanKey},\n  title={${title}},\n  author={${authorsStr}},\n  journal={${journalTitle}},\n  year={${year}},\n  doi={${doiClean}}\n}`
  }

  function handleCopyCitation() {
    if (!citePublication) return
    const text = getCitationText(citePublication, citationFormat)
    navigator.clipboard.writeText(text)
    setCopiedCitation(true)
    setTimeout(() => setCopiedCitation(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/authors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-text transition-colors group cursor-pointer"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span>{t("backToAuthors")}</span>
        </Link>
      </div>

      <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-6 sm:p-7 shadow-xs space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 dark:bg-brand/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" aria-hidden="true" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
            <div className="relative shrink-0">
              <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-br from-brand to-indigo-700 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm border-2 border-border/40 select-none">
                {initials}
              </div>
              <span
                className="absolute -bottom-1 -right-1 size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-card shadow-xs"
                title={t("verifiedProfile")}
              >
                <UserCheck className="size-3.5" aria-hidden="true" />
              </span>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  {t("authorDetails")}
                </span>
                {author.numberInRating !== null && author.numberInRating !== undefined && (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 whitespace-nowrap shadow-2xs">
                    <Award className="size-3 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
                    <span>{t("rankInRating", { rank: author.numberInRating })}</span>
                  </span>
                )}
                {author.importedBy && (
                  <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border whitespace-nowrap">
                    {author.importedBy}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight leading-snug">
                {fullName || "—"}
              </h1>

              {cleanOrcid && (
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <div className="inline-flex items-center gap-1.5 bg-well text-foreground px-2.5 py-1 rounded-lg border border-well-border text-[11px] font-mono whitespace-nowrap shrink-0">
                    <OrcidIcon />
                    <a
                      href={`https://orcid.org/${cleanOrcid}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hover:underline font-semibold text-foreground inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      <span className="whitespace-nowrap">{cleanOrcid}</span>
                      <ExternalLink className="size-2.5 text-muted-foreground shrink-0" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(cleanOrcid, "orcid")}
                      className="ml-1 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer shrink-0 transition-colors"
                      aria-label="Copy ORCID"
                    >
                      {copiedField === "orcid" ? (
                        <Check className="size-3 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Copy className="size-3" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 h-8 min-h-8 max-h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer select-none"
            >
              {shared ? (
                <>
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t("linkCopied")}</span>
                </>
              ) : (
                <>
                  <Share2 className="size-3.5 text-brand-text" aria-hidden="true" />
                  <span>{t("share")}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExportBibtex}
              disabled={bibtexStatus === "loading"}
              className="relative overflow-hidden inline-flex items-center gap-1.5 h-8 min-h-8 max-h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer select-none disabled:opacity-80 disabled:cursor-wait"
            >
              {bibtexStatus === "loading" && (
                <span className="absolute bottom-0 left-0 h-[2px] bg-brand animate-pulse w-full" aria-hidden="true" />
              )}
              {bibtexStatus === "success" ? (
                <>
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-75 duration-200" aria-hidden="true" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t("downloadedExcel")}</span>
                </>
              ) : bibtexStatus === "loading" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-brand-text shrink-0" aria-hidden="true" />
                  <span className="text-muted-foreground">{t("downloadingExcel")}</span>
                </>
              ) : (
                <>
                  <Download className="size-3.5 text-brand-text" aria-hidden="true" />
                  <span>{t("exportBibtex")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-brand-subtle border border-brand-border text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-brand-subtle-foreground uppercase tracking-tight">
              <TrendingUp className="size-3 shrink-0 text-brand-text" aria-hidden="true" />
              <span>{t("academicIndex")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-brand-subtle-foreground font-mono tracking-tight block mt-1">
              {formattedIndex}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
              <FileText className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>{t("totalPublications")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground font-mono tracking-tight block mt-1">
              {totalPubCount.toLocaleString("uk-UA")}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
              <Quote className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>{t("totalCitations")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground font-mono tracking-tight block mt-1">
              {totalCitsCount.toLocaleString("uk-UA")}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
              <BookOpen className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>{t("importedJournals")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground font-mono tracking-tight block mt-1">
              {(importedJournalsCount ?? uniqueJournals.length).toLocaleString("uk-UA")}
            </span>
          </div>
        </div>

        <div className="border-t border-border/60 pt-2">
          <TabsList aria-label="Author Tabs">
            <TabsTrigger
              isActive={activeTab === "publications"}
              onClick={() => setActiveTab("publications")}
            >
              <FileText className="size-3.5" aria-hidden="true" />
              <span>{t("tabPublications")}</span>
              <span className="ml-1 text-[10px] font-mono opacity-80">
                ({publications?.length ?? 0})
              </span>
            </TabsTrigger>

            <TabsTrigger
              isActive={activeTab === "coAuthors"}
              onClick={() => setActiveTab("coAuthors")}
            >
              <Users className="size-3.5" aria-hidden="true" />
              <span>{t("tabCoAuthors")}</span>
              <span className="ml-1 text-[10px] font-mono opacity-80">
                ({coAuthors.length})
              </span>
            </TabsTrigger>

            <TabsTrigger
              isActive={activeTab === "journals"}
              onClick={() => setActiveTab("journals")}
            >
              <BookOpen className="size-3.5" aria-hidden="true" />
              <span>{t("tabJournals")}</span>
              <span className="ml-1 text-[10px] font-mono opacity-80">
                ({uniqueJournals.length || importedJournalsCount})
              </span>
            </TabsTrigger>

            <TabsTrigger
              isActive={activeTab === "metrics"}
              onClick={() => setActiveTab("metrics")}
            >
              <GraduationCap className="size-3.5" aria-hidden="true" />
              <span>{t("tabMetrics")}</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {activeTab === "publications" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-3.5 shadow-xs">
            <div className="relative flex-1">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" aria-hidden="true" />
              <input
                type="text"
                value={pubSearch}
                onChange={(e) => setPubSearch(sanitizeString(e.target.value))}
                placeholder={t("searchPublications")}
                className="w-full h-8 pl-8 pr-3 text-xs font-medium rounded-lg border border-well-border bg-well text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end">
              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline text-muted-foreground font-medium shrink-0">
                  {t("sortPublications")}
                </span>
                <Select
                  selectedKey={sortOption}
                  onSelectionChange={(key) => {
                    if (isPublicationSortOption(key)) {
                      setSortOption(key)
                    }
                  }}
                  aria-label={t("sortPublications")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem id="DATE_DESC">{t("sortDateDesc")}</SelectItem>
                    <SelectItem id="DATE_ASC">{t("sortDateAsc")}</SelectItem>
                    <SelectItem id="CITATIONS_DESC">{t("sortCitationsDesc")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ExcelDownloadButton
                endpoint={`/api/authors/${cleanOrcid}/download/excel`}
                filename={`${author.lastName ?? "author"}_publications.xlsx`}
                fallbackData={() => {
                  const header = "#;Назва праці;Рік;Видання;DOI;Цитування\n"
                  const rows = (publications ?? [])
                    .map((p, i) => `${i + 1};${p.name ?? ""};${p.publicationDate ?? ""};${p.journal?.title ?? ""};${p.doi};${p.totalCitations ?? 0}`)
                    .join("\n")
                  return `\uFEFF${header}${rows}`
                }}
              />
            </div>
          </div>

          {filteredPublications.length === 0 ? (
            <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-12 text-center space-y-2 shadow-xs">
              <FileText className="size-8 text-muted-foreground mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">
                {t("noPublicationsFound")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPublications.map((pub) => {
                const journalTitle = pub.journal?.title
                const journalIssn = pub.journal?.printIssn || pub.journal?.onlineIssn
                const doiClean = pub.doi.replace("https://doi.org/", "")

                return (
                  <article
                    key={pub.doi || pub.name}
                    className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-5 shadow-xs hover:border-brand-border transition-all space-y-3 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <h2 className="text-sm sm:text-base font-bold text-foreground leading-snug group-hover:text-brand-text-hover transition-colors">
                          {pub.name}
                        </h2>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          {journalTitle && (
                            <span className="font-semibold text-foreground inline-flex items-center gap-1">
                              <BookOpen className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                              {journalIssn ? (
                                <Link
                                  href={`/journals/${encodeURIComponent(journalIssn)}`}
                                  className="hover:underline hover:text-brand-text-hover"
                                >
                                  {journalTitle}
                                </Link>
                              ) : (
                                <span>{journalTitle}</span>
                              )}
                            </span>
                          )}

                          {pub.publicationDate && (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                              <Calendar className="size-3 text-muted-foreground" aria-hidden="true" />
                              <span>{pub.publicationDate}</span>
                            </span>
                          )}

                          {doiClean && (
                            <div className="inline-flex items-center gap-1 font-mono text-[11px] bg-well px-2 py-0.5 rounded-md border border-well-border">
                              <span>DOI:</span>
                              <a
                                href={`https://doi.org/${doiClean}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-brand-text hover:text-brand-text-hover hover:underline"
                              >
                                {doiClean}
                              </a>
                              <button
                                type="button"
                                onClick={() => handleCopy(doiClean, `doi-${doiClean}`)}
                                className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                                aria-label="Copy DOI"
                              >
                                {copiedField === `doi-${doiClean}` ? (
                                  <Check className="size-2.5 text-emerald-600" aria-hidden="true" />
                                ) : (
                                  <Copy className="size-2.5" aria-hidden="true" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center sm:items-end sm:flex-col gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-brand-subtle text-brand-subtle-foreground border border-brand-border px-2.5 py-1 rounded-lg shadow-2xs">
                          <Quote className="size-3 text-brand-text" aria-hidden="true" />
                          <span>{pub.totalCitations ?? 0}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => setCitePublication(pub)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-brand-text transition-colors cursor-pointer"
                        >
                          <Quote className="size-3" aria-hidden="true" />
                          <span>{t("cite")}</span>
                        </button>
                      </div>
                    </div>

                    {pub.authors && pub.authors.length > 0 && (
                      <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-muted-foreground font-medium">
                          {t("tabCoAuthors")}:
                        </span>
                        {pub.authors.map((auth, idx) => {
                          const authName = `${auth.firstName ?? ""} ${auth.lastName ?? ""}`.trim()
                          const authCleanOrcid = (auth.orcid ?? "").replace("https://orcid.org/", "")
                          return (
                            <span key={auth.orcid || idx} className="inline-flex items-center">
                              {authCleanOrcid ? (
                                <Link
                                  href={`/authors/${authCleanOrcid}/details`}
                                  className="text-foreground hover:text-brand-text font-semibold hover:underline"
                                >
                                  {authName || authCleanOrcid}
                                </Link>
                              ) : (
                                <span className="text-muted-foreground">{authName}</span>
                              )}
                              {idx < pub.authors.length - 1 && <span className="text-muted-foreground mr-1">,</span>}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "coAuthors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("coAuthors")}: {coAuthors.length}
            </span>
            <ExcelDownloadButton
              endpoint={`/api/authors/${cleanOrcid}/download/excel?type=coauthors`}
              filename={`${author.lastName ?? "author"}_coauthors.xlsx`}
              fallbackData={() => {
                const header = "#;Співавтор;ORCID;Академічний індекс\n"
                const rows = (coAuthors ?? [])
                  .map((c, i) => `${i + 1};${c.lastName ?? ""} ${c.firstName ?? ""};${c.orcid};${c.academicIndex ?? ""}`)
                  .join("\n")
                return `\uFEFF${header}${rows}`
              }}
            />
          </div>

          {coAuthors.length === 0 ? (
            <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-12 text-center space-y-2 shadow-xs">
              <Users className="size-8 text-muted-foreground mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">
                {t("noCoAuthorsFound")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coAuthors.map((coAuth) => {
                const coCleanOrcid = (coAuth.orcid ?? "").replace("https://orcid.org/", "")
                const coFullName = `${coAuth.firstName ?? ""} ${coAuth.lastName ?? ""}`.trim()
                const coIndex =
                  coAuth.academicIndex !== null && coAuth.academicIndex !== undefined
                    ? coAuth.academicIndex.toFixed(2).replace(".", ",")
                    : "—"

                return (
                  <div
                    key={coAuth.orcid}
                    className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-xl border border-border/80 p-4 shadow-xs hover:border-brand-border transition-all space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <Link
                          href={`/authors/${coCleanOrcid}/details`}
                          className="font-bold text-sm text-foreground hover:text-brand-text-hover transition-colors block line-clamp-1 group-hover:text-brand-text-hover"
                        >
                          {coFullName || coCleanOrcid}
                        </Link>
                        {coCleanOrcid && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                            <OrcidIcon />
                            <span>{coCleanOrcid}</span>
                          </div>
                        )}
                      </div>

                      <span className="inline-block font-mono font-extrabold text-brand-subtle-foreground bg-brand-subtle border border-brand-border px-2 py-0.5 rounded-md text-xs shrink-0 shadow-2xs">
                        {coIndex}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">
                        {coAuth.numberInRating
                          ? t("rankInRating", { rank: coAuth.numberInRating })
                          : t("authorDetails")}
                      </span>
                      <Link
                        href={`/authors/${coCleanOrcid}/details`}
                        className="text-brand-text hover:text-brand-text-hover hover:underline font-semibold"
                      >
                        {t("profile")}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "journals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("journals")}: {uniqueJournals.length}
            </span>
            <ExcelDownloadButton
              endpoint={`/api/authors/${cleanOrcid}/download/excel?type=journals`}
              filename={`${author.lastName ?? "author"}_journals.xlsx`}
              fallbackData={() => {
                const header = "#;Журнал;ISSN;Публікацій\n"
                const rows = (uniqueJournals ?? [])
                  .map((j, i) => `${i + 1};${j.title ?? ""};${j.issn ?? ""};${j.count ?? 0}`)
                  .join("\n")
                return `\uFEFF${header}${rows}`
              }}
            />
          </div>

          {uniqueJournals.length === 0 ? (
            <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-12 text-center space-y-2 shadow-xs">
              <BookOpen className="size-8 text-muted-foreground mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">
                {t("noJournalsFound")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {uniqueJournals.map((jr) => (
                <div
                  key={jr.issn || jr.title}
                  className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-xl border border-border/80 p-4 shadow-xs space-y-3 hover:border-brand-border transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-brand-text-hover transition-colors">
                        {jr.title}
                      </h3>
                      {jr.issn && (
                        <span className="font-mono text-xs text-muted-foreground block">
                          ISSN: {jr.issn}
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-muted text-foreground border border-border/70 shrink-0">
                      {jr.count} статей
                    </span>
                  </div>

                  {jr.issn && (
                    <div className="pt-2 border-t border-border/60 text-right">
                      <Link
                        href={`/journals/${encodeURIComponent(jr.issn)}`}
                        className="text-xs text-brand-text hover:text-brand-text-hover hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <span>{t("viewJournal")}</span>
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "metrics" && (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-5 text-brand-text" aria-hidden="true" />
            <h2 className="text-base font-bold text-foreground">
              {t("verifiedProfile")}
            </h2>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("verifiedProfileDesc")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                {t("academicIndex")}
              </span>
              <span className="text-xl font-black font-mono text-brand-text block">
                {formattedIndex}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Розраховано за сукупністю цитувань та актуальних робіт
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                {t("totalCitations")}
              </span>
              <span className="text-xl font-black font-mono text-foreground block">
                {totalCitsCount.toLocaleString("uk-UA")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Усі верифіковані цитування у фахових виданнях
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                {t("totalPublications")}
              </span>
              <span className="text-xl font-black font-mono text-foreground block">
                {totalPubCount.toLocaleString("uk-UA")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Наукові праці автора, зареєстровані в системі
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                {t("avgCitations")}
              </span>
              <span className="text-xl font-black font-mono text-foreground block">
                {avgCitationsPerPub}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Середня кількість цитувань однієї публікації
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                Позиція в базі даних
              </span>
              <span className="text-xl font-black font-mono text-foreground block">
                {author.numberInRating ? `#${author.numberInRating}` : "—"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Місце автора в національному рейтингу
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                Мережа співавторства
              </span>
              <span className="text-xl font-black font-mono text-foreground block">
                {coAuthors.length.toLocaleString("uk-UA")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Зареєстровані наукові партнери та співавтори
              </span>
            </div>
          </div>
        </div>
      )}

      {citePublication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl p-5 sm:p-6 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cite-modal-title"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 id="cite-modal-title" className="text-sm font-bold text-foreground">
                {t("citationModalTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setCitePublication(null)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                aria-label={t("close")}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-well rounded-xl border border-well-border text-xs">
              <button
                type="button"
                onClick={() => setCitationFormat("dstu")}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  citationFormat === "dstu"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ДСТУ 8302:2015
              </button>
              <button
                type="button"
                onClick={() => setCitationFormat("apa")}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  citationFormat === "apa"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                APA 7th
              </button>
              <button
                type="button"
                onClick={() => setCitationFormat("bibtex")}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  citationFormat === "bibtex"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                BibTeX
              </button>
            </div>

            <pre className="p-3.5 bg-well rounded-xl border border-well-border text-xs text-foreground font-mono whitespace-pre-wrap break-all max-h-48 overflow-y-auto leading-relaxed select-all">
              {getCitationText(citePublication, citationFormat)}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCitePublication(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {t("close")}
              </button>

              <button
                type="button"
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 transition-all cursor-pointer shadow-xs"
              >
                {copiedCitation ? (
                  <>
                    <Check className="size-3.5" aria-hidden="true" />
                    <span>{t("copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden="true" />
                    <span>{t("copyText")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
