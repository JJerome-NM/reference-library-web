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
  TrendingUp,
  UserCheck,
  Users,
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
import { sanitizeString } from "@/src/shared/lib/sanitizer"
import type { AuthorDetailsResponse } from "@/src/entities/author"

interface AuthorDetailsViewProps {
  data: AuthorDetailsResponse
}

type TabType = "publications" | "coAuthors" | "journals" | "metrics"

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
  const [sortOption, setSortOption] = useState<"DATE_DESC" | "DATE_ASC" | "CITATIONS_DESC">("DATE_DESC")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const cleanOrcid = (author.orcid ?? "").replace("https://orcid.org/", "")
  const fullName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
  const initials = `${(author.firstName?.[0] ?? "").toUpperCase()}${(author.lastName?.[0] ?? "").toUpperCase()}` || "U"

  const formattedIndex =
    author.academicIndex !== null && author.academicIndex !== undefined
      ? author.academicIndex.toFixed(2).replace(".", ",")
      : "—"

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

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/authors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-blue-600 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span>{t("backToAuthors")}</span>
        </Link>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm border-2 border-border/40 select-none">
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
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/60 whitespace-nowrap">
                    <Award className="size-3 text-amber-600 shrink-0" aria-hidden="true" />
                    <span>{t("rankInRating", { rank: author.numberInRating })}</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight leading-snug">
                {fullName || "—"}
              </h1>

              {cleanOrcid && (
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <div className="inline-flex items-center gap-1.5 bg-muted/60 text-foreground px-2.5 py-1 rounded-lg border border-border/80 text-[11px] font-mono whitespace-nowrap shrink-0">
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
                      className="ml-1 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer shrink-0"
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-tight">
              <TrendingUp className="size-3 shrink-0" aria-hidden="true" />
              <span>{t("academicIndex")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-400 font-mono tracking-tight block mt-1">
              {formattedIndex}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
              <FileText className="size-3 shrink-0" aria-hidden="true" />
              <span>{t("totalPublications")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground font-mono tracking-tight block mt-1">
              {(statistics?.totalPublications ?? publications?.length ?? 0).toLocaleString("uk-UA")}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
              <Quote className="size-3 shrink-0" aria-hidden="true" />
              <span>{t("totalCitations")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground font-mono tracking-tight block mt-1">
              {(statistics?.totalCitationsPerAllPublications ?? 0).toLocaleString("uk-UA")}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
              <BookOpen className="size-3 shrink-0" aria-hidden="true" />
              <span>{t("importedJournals")}</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground font-mono tracking-tight block mt-1">
              {(importedJournalsCount ?? uniqueJournals.length).toLocaleString("uk-UA")}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-2">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card rounded-2xl border border-border p-3.5 shadow-xs">
            <div className="relative flex-1">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" aria-hidden="true" />
              <input
                type="text"
                value={pubSearch}
                onChange={(e) => setPubSearch(sanitizeString(e.target.value))}
                placeholder={t("searchPublications")}
                className="w-full h-8 pl-8 pr-3 text-xs font-medium rounded-lg border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium shrink-0">
                {t("sortPublications")}
              </span>
              <Select
                selectedKey={sortOption}
                onSelectionChange={(key) =>
                  setSortOption(key as "DATE_DESC" | "DATE_ASC" | "CITATIONS_DESC")
                }
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
          </div>

          {filteredPublications.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center space-y-2 shadow-xs">
              <FileText className="size-8 text-muted-foreground mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">
                {t("noPublicationsFound")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPublications.map((pub) => {
                const journalTitle = pub.journal?.title
                const journalIssn = pub.journal?.printIssn || pub.journal?.onlineIssn || pub.printIssn
                const doiClean = (pub.doi ?? "").replace("https://doi.org/", "")

                return (
                  <article
                    key={pub.doi || pub.name}
                    className="bg-card rounded-2xl border border-border p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition-all space-y-3 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <h2 className="text-sm sm:text-base font-bold text-foreground leading-snug group-hover:text-blue-600 transition-colors">
                          {pub.name}
                        </h2>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {journalTitle && (
                            <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/80 text-[11px]">
                              <BookOpen className="size-3 text-blue-600" aria-hidden="true" />
                              {journalIssn ? (
                                <Link
                                  href={`/journals/${encodeURIComponent(journalIssn)}`}
                                  className="hover:underline hover:text-blue-600"
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
                            <div className="inline-flex items-center gap-1 font-mono text-[11px] bg-muted/40 px-2 py-0.5 rounded-md border border-border/60">
                              <span>DOI:</span>
                              <a
                                href={`https://doi.org/${doiClean}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-blue-600 hover:underline"
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

                      <div className="flex items-center sm:items-end sm:flex-col gap-1.5 shrink-0">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 px-2.5 py-1 rounded-lg">
                          <Quote className="size-3 text-blue-600" aria-hidden="true" />
                          <span>{pub.totalCitations ?? 0}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                          {t("totalCitations")}
                        </span>
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
                                  href={`/authors/${authCleanOrcid}`}
                                  className="text-foreground hover:text-blue-600 font-semibold hover:underline"
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
          {coAuthors.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center space-y-2 shadow-xs">
              <Users className="size-8 text-muted-foreground mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">
                {t("noCoAuthorsFound")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {coAuthors.map((coAuth) => {
                const coFullName = `${coAuth.firstName ?? ""} ${coAuth.lastName ?? ""}`.trim()
                const coCleanOrcid = (coAuth.orcid ?? "").replace("https://orcid.org/", "")
                const coIndex =
                  coAuth.academicIndex !== null && coAuth.academicIndex !== undefined
                    ? coAuth.academicIndex.toFixed(2).replace(".", ",")
                    : "—"

                return (
                  <div
                    key={coAuth.orcid}
                    className="bg-card rounded-xl border border-border p-4 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition-all space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <Link
                          href={`/authors/${coCleanOrcid}`}
                          className="font-bold text-sm text-foreground hover:text-blue-600 transition-colors block line-clamp-1 group-hover:text-blue-600"
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

                      <span className="inline-block font-mono font-extrabold text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 px-2 py-0.5 rounded-md text-xs shrink-0">
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
                        href={`/authors/${coCleanOrcid}`}
                        className="text-blue-600 hover:underline font-semibold"
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
          {uniqueJournals.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center space-y-2 shadow-xs">
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
                  className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-blue-600 transition-colors">
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
                        className="text-xs text-blue-600 hover:underline font-semibold inline-flex items-center gap-1"
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
        <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-5 text-blue-600" aria-hidden="true" />
            <h2 className="text-base font-bold text-foreground">
              {t("verifiedProfile")}
            </h2>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("verifiedProfileDesc")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                {t("academicIndex")}
              </span>
              <span className="text-lg font-black font-mono text-blue-600 dark:text-blue-400 block">
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
              <span className="text-lg font-black font-mono text-foreground block">
                {(statistics?.totalCitationsPerAllPublications ?? 0).toLocaleString("uk-UA")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Усі верифіковані цитування у фахових виданнях
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                Позиція в базі даних
              </span>
              <span className="text-lg font-black font-mono text-foreground block">
                {author.numberInRating ? `#${author.numberInRating}` : "—"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Серед 600+ зареєстрованих науковців України
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
