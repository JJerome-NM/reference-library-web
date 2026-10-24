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
} from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import { TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { sanitizeString } from "@/src/shared/lib/sanitizer"
import type { JournalDetailsResponse } from "@/src/entities/journal"

interface JournalDetailsViewProps {
  data: JournalDetailsResponse
}

type TabType = "issues" | "authors" | "about"

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
  const [copiedField, setCopiedField] = useState<string | null>(null)

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const filteredVersions = useMemo(() => {
    const q = issueSearch.trim().toLowerCase()
    if (!q) return journal.journalVersions
    return journal.journalVersions.filter((v) => {
      const matchNum = String(v.versionNumber ?? "").includes(q)
      const matchDoi = (v.doi ?? "").toLowerCase().includes(q)
      const matchDate = (v.publishedDate ?? "").toLowerCase().includes(q)
      return matchNum || matchDoi || matchDate
    })
  }, [journal.journalVersions, issueSearch])

  const formattedIndex =
    academicIndex !== null ? academicIndex.toFixed(1).replace(".", ",") : "—"

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/journals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-blue-600 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span>{t("backToJournals")}</span>
        </Link>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
              <BookOpen className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("journalDetails")}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight leading-snug">
            {journal.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {journal.printIssn && (
              <div className="inline-flex items-center gap-1.5 bg-muted/60 text-foreground px-2.5 py-1 rounded-lg border border-border/80 font-mono text-[11px] whitespace-nowrap">
                <span className="text-muted-foreground font-sans font-bold text-[10px]">
                  {t("printIssn")}:
                </span>
                <span>{journal.printIssn}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(journal.printIssn!, "pissn")}
                  className="hover:text-blue-600 text-muted-foreground cursor-pointer transition-colors"
                  aria-label="Copy print ISSN"
                >
                  {copiedField === "pissn" ? (
                    <Check className="size-3 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy className="size-3" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}

            {journal.onlineIssn && (
              <div className="inline-flex items-center gap-1.5 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg border border-blue-200/60 dark:border-blue-800/60 font-mono text-[11px] whitespace-nowrap">
                <span className="text-blue-600 dark:text-blue-500 font-sans font-bold text-[10px]">
                  {t("onlineIssn")}:
                </span>
                <span>{journal.onlineIssn}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(journal.onlineIssn!, "eissn")}
                  className="hover:text-blue-800 text-blue-600 dark:text-blue-400 cursor-pointer transition-colors"
                  aria-label="Copy online ISSN"
                >
                  {copiedField === "eissn" ? (
                    <Check className="size-3 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy className="size-3" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-center">
            <span className="text-[10px] font-bold uppercase tracking-tight text-blue-700 dark:text-blue-400 flex items-center justify-center gap-1 block">
              <Award className="size-3 text-blue-600 shrink-0" aria-hidden="true" />
              {t("academicIndex")}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-blue-700 dark:text-blue-400 font-mono tracking-tight block mt-1">
              {formattedIndex}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground flex items-center justify-center gap-1 block">
              <Layers className="size-3 text-emerald-600 shrink-0" aria-hidden="true" />
              {t("versionsCount", { count: "" }).trim()}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight block mt-1">
              {journal.versionsCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground flex items-center justify-center gap-1 block">
              <Users className="size-3 text-indigo-600 shrink-0" aria-hidden="true" />
              {t("authorsCount", { count: "" }).trim()}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight block mt-1">
              {journal.authorsCount ?? journal.authors.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground flex items-center justify-center gap-1 block">
              <TrendingUp className="size-3 text-amber-600 shrink-0" aria-hidden="true" />
              {t("impactFactor")}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight block mt-1">
              {journal.impactFactor ?? "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <TabsList aria-label="Journal Tabs">
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-xs">
                <Search className="size-3.5 text-muted-foreground absolute left-3 top-3" aria-hidden="true" />
                <input
                  type="text"
                  placeholder={t("searchIssues")}
                  value={issueSearch}
                  onChange={(e) => setIssueSearch(sanitizeString(e.target.value))}
                  className="w-full h-9 pl-9 pr-3 bg-card border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div className="text-xs text-muted-foreground font-medium self-end sm:self-center">
                <span>
                  {t("allIssues")}: {filteredVersions.length}
                </span>
              </div>
            </div>

            {filteredVersions.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center space-y-2 shadow-xs">
                <p className="text-xs font-bold text-foreground">{t("noIssuesFound")}</p>
                <button
                  type="button"
                  onClick={() => setIssueSearch("")}
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  {t("resetFilters")}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredVersions.map((version) => {
                  return (
                    <div
                      key={version.doi || version.versionNumber}
                      className="bg-card rounded-2xl border border-border p-5 shadow-xs hover:border-blue-200 dark:hover:border-blue-800 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-extrabold text-sm text-foreground flex items-center gap-2">
                          <Layers className="size-4 text-blue-600" aria-hidden="true" />
                          <span>
                            {t("issueNumber", { number: version.versionNumber ?? "—" })}
                          </span>
                        </span>

                        {version.publishedDate && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Calendar className="size-3.5" aria-hidden="true" />
                            <span>
                              {t("publishedDate")} {version.publishedDate}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            DOI:
                          </span>
                          <a
                            href={`https://doi.org/${version.doi}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                          >
                            <span>{version.doi}</span>
                            <ExternalLink className="size-3" aria-hidden="true" />
                          </a>
                        </div>

                        <Link
                          href={`/publications?journals=${encodeURIComponent(journal.title ?? "")}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all shadow-2xs"
                        >
                          <FileText className="size-3 text-blue-600" aria-hidden="true" />
                          <span>{t("viewIssueArticles")}</span>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "authors" && (
          <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
            {journal.authors.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                <Users className="size-8 mx-auto text-muted-foreground" aria-hidden="true" />
                <p>{t("noAuthorsFound")}</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {journal.authors.map((author) => {
                  const fullName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
                  const orcidPure = author.orcid.replace("https://orcid.org/", "")
                  const formattedAuthIndex =
                    author.academicIndex !== null
                      ? author.academicIndex.toFixed(2).replace(".", ",")
                      : "—"

                  return (
                    <div
                      key={author.orcid}
                      className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <Link
                          href={`/authors/${orcidPure}/details`}
                          className="font-bold text-sm text-foreground hover:text-blue-600 hover:underline transition-colors block"
                        >
                          {fullName}
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

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 px-2.5 py-0.5 rounded-md text-xs">
                          {formattedAuthIndex}
                        </span>
                        <Link
                          href={`/authors/${orcidPure}/details`}
                          className="text-xs font-semibold text-muted-foreground hover:text-blue-600"
                        >
                          {t("about")}
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
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4 text-xs leading-relaxed text-muted-foreground">
            <h2 className="text-sm font-bold text-foreground">
              {t("metricOverview")}
            </h2>
            <p>
              Видання «{journal.title}» індексується в національній наукометричній базі даних «Академічний Індекс». База забезпечує верифіковану оцінку цитованості наукових публікацій, прозорий облік випусків журналу та моніторинг академічних індексів авторів.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="font-bold text-foreground block">Міжнародна ідентифікація</span>
                <span>Видання має офіційні зареєстровані ідентифікатори ISSN та публікує статті із присвоєнням префіксів CrossRef DOI.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="font-bold text-foreground block">Індексація випусків</span>
                <span>Усі опубліковані випуски автоматично синхронізуються із профілями авторів та реєстром установ платформи.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
