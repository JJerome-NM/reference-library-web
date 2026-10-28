"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  Building2,
  Globe,
  ExternalLink,
  Users,
  Search,
  Copy,
  Check,
  TrendingUp,
  Info,
  BookOpen,
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
import type { InstitutionDetailsResponse } from "@/src/entities/institution"

interface InstitutionDetailsViewProps {
  data: InstitutionDetailsResponse
}

type TabType = "authors" | "about"
type InstitutionAuthorSortOption = "INDEX_DESC" | "NAME_ASC"

function isInstitutionAuthorSortOption(key: unknown): key is InstitutionAuthorSortOption {
  return key === "INDEX_DESC" || key === "NAME_ASC"
}

function OrcidIcon() {
  return (
    <svg className="size-3.5 fill-[#A6CE39] shrink-0" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0ZM86.35,186.29H67.11V79.71H86.35Zm-9.62-120a11.19,11.19,0,1,1,11.19-11.19A11.19,11.19,0,0,1,76.73,66.29ZM197.89,141a38.41,38.41,0,0,1-13.43,29.93c-9.52,8.34-22.78,12.56-39.77,12.56H111.41V79.71h35.83c16.14,0,28.84,4.28,38.09,12.84A41,41,0,0,1,197.89,141Zm-20.1,0a24.16,24.16,0,0,0-7-18.08c-4.66-4.52-11.39-6.81-20.19-6.81h-19.1v49.8h19.1c9,0,15.82-2.35,20.45-7.05A24.47,24.47,0,0,0,177.79,141Z" />
    </svg>
  )
}

export function InstitutionDetailsView({ data }: InstitutionDetailsViewProps) {
  const t = useTranslations("institutionsPage")
  const { institution, authors, authorCount } = data

  const [activeTab, setActiveTab] = useState<TabType>("authors")
  const [authorSearch, setAuthorSearch] = useState("")
  const [sortOption, setSortOption] = useState<"INDEX_DESC" | "NAME_ASC">("INDEX_DESC")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const filteredAuthors = useMemo(() => {
    let list = [...(authors.content ?? [])]
    const q = authorSearch.trim().toLowerCase()
    if (q) {
      list = list.filter((a) => {
        const fullName = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase()
        const orcid = (a.orcid ?? "").toLowerCase()
        return fullName.includes(q) || orcid.includes(q)
      })
    }
    if (sortOption === "NAME_ASC") {
      list.sort((a, b) => (a.lastName ?? "").localeCompare(b.lastName ?? ""))
    } else {
      list.sort((a, b) => (b.academicIndex ?? 0) - (a.academicIndex ?? 0))
    }
    return list
  }, [authors.content, authorSearch, sortOption])

  const formattedIndex =
    institution.academicIndex !== null
      ? institution.academicIndex.toFixed(2).replace(".", ",")
      : "—"

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/institutions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-text transition-colors group cursor-pointer"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span>{t("backToInstitutions")}</span>
        </Link>
      </div>

      <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-subtle text-brand-text border border-brand-border">
                <Building2 className="size-5" aria-hidden="true" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("institutionDetails")}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight leading-snug">
              {institution.nameUA || institution.nameEN}
            </h1>

            {institution.nameEN && institution.nameUA && (
              <p className="text-xs text-muted-foreground font-medium">
                {institution.nameEN}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-muted/60 text-foreground px-2.5 py-1 rounded-lg border border-border/80 font-medium text-[11px] whitespace-nowrap">
                <Globe className="size-3 text-brand-text" aria-hidden="true" />
                <span>{institution.country || "—"}</span>
              </span>

              {institution.url && (
                <div className="inline-flex items-center gap-1 bg-muted/60 text-foreground px-2.5 py-1 rounded-lg border border-border/80 text-[11px] whitespace-nowrap">
                  <a
                    href={institution.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-brand-text hover:text-brand-text-hover hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t("website")}</span>
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(institution.url!, "url")}
                    className="ml-1 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Copy website URL"
                  >
                    {copiedField === "url" ? (
                      <Check className="size-3 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row sm:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none p-3.5 sm:p-4 rounded-xl bg-brand-subtle border border-brand-border min-w-[120px] sm:min-w-[140px] text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-brand-subtle-foreground uppercase tracking-tight">
                <TrendingUp className="size-3.5 text-brand-text" aria-hidden="true" />
                <span>{t("academicIndex")}</span>
              </div>
              <span className="text-2xl font-black text-brand-subtle-foreground font-mono tracking-tight block mt-1">
                {formattedIndex}
              </span>
            </div>

            <div className="flex-1 sm:flex-none p-3.5 sm:p-4 rounded-xl bg-muted/50 border border-border min-w-[120px] sm:min-w-[140px] text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                <Users className="size-3.5" aria-hidden="true" />
                <span>{t("authorsCount", { count: "" }).trim()}</span>
              </div>
              <span className="text-2xl font-black text-foreground font-mono tracking-tight block mt-1">
                {authorCount.toLocaleString("uk-UA")}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-2">
          <TabsList aria-label="Institution Tabs">
            <TabsTrigger
              isActive={activeTab === "authors"}
              onClick={() => setActiveTab("authors")}
            >
              <Users className="size-3.5" aria-hidden="true" />
              <span>{t("authorsList")}</span>
              <span className="ml-1 text-[10px] font-mono opacity-80">
                ({authorCount})
              </span>
            </TabsTrigger>

            <TabsTrigger
              isActive={activeTab === "about"}
              onClick={() => setActiveTab("about")}
            >
              <Info className="size-3.5" aria-hidden="true" />
              <span>{t("aboutInstitution")}</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {activeTab === "authors" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card rounded-2xl border border-border p-3.5 shadow-xs">
            <div className="relative flex-1">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" aria-hidden="true" />
              <input
                type="text"
                value={authorSearch}
                onChange={(e) => setAuthorSearch(sanitizeString(e.target.value))}
                placeholder={t("searchAuthors")}
                className="w-full h-8 pl-8 pr-3 text-xs font-medium rounded-lg border border-well-border bg-well text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium shrink-0">
                {t("sortAuthors")}
              </span>
              <Select
                selectedKey={sortOption}
                onSelectionChange={(key) => {
                  if (isInstitutionAuthorSortOption(key)) {
                    setSortOption(key)
                  }
                }}
                aria-label={t("sortAuthors")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="INDEX_DESC">{t("sortAuthorIndex")}</SelectItem>
                  <SelectItem id="NAME_ASC">{t("sortAuthorName")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredAuthors.length === 0 ? (
            <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-10 text-center space-y-2 shadow-xs">
              <Users className="size-8 text-muted-foreground mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">
                {t("noAuthorsFound")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAuthors.map((author) => {
                const authorFullName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
                const authorIndexFormatted =
                  author.academicIndex !== null && author.academicIndex !== undefined
                    ? author.academicIndex.toFixed(2).replace(".", ",")
                    : "—"
                const orcidClean = (author.orcid ?? "").replace("https://orcid.org/", "")

                return (
                  <div
                    key={author.orcid}
                    className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-xl border border-border/80 p-4 shadow-xs hover:border-brand-border transition-all space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <Link
                          href={`/authors/${orcidClean}`}
                          className="font-bold text-sm text-foreground hover:text-brand-text-hover transition-colors block line-clamp-1 group-hover:text-brand-text-hover"
                        >
                          {authorFullName || "—"}
                        </Link>
                        {author.orcid && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                            <OrcidIcon />
                            <a
                              href={`https://orcid.org/${orcidClean}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="hover:text-foreground transition-colors hover:underline"
                            >
                              {orcidClean}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(orcidClean, `orcid-${orcidClean}`)}
                              className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                              aria-label="Copy ORCID"
                            >
                              {copiedField === `orcid-${orcidClean}` ? (
                                <Check className="size-2.5 text-emerald-600" aria-hidden="true" />
                              ) : (
                                <Copy className="size-2.5" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="inline-block font-mono font-extrabold text-brand-subtle-foreground bg-brand-subtle border border-brand-border px-2 py-0.5 rounded-md text-xs shadow-2xs">
                          {authorIndexFormatted}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="size-3" aria-hidden="true" />
                        <span>{institution.country || "Ukraine"}</span>
                      </span>

                      <Link
                        href={`/authors/${orcidClean}`}
                        className="text-brand-text hover:text-brand-text-hover hover:underline font-semibold"
                      >
                        {t("viewDetails")}
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
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Info className="size-4 text-brand-text" aria-hidden="true" />
            <h2 className="text-sm font-bold text-foreground">
              {t("aboutInstitution")}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("aboutInstitutionDesc")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                {t("tableUAName")}
              </span>
              <span className="font-semibold text-foreground">
                {institution.nameUA || "—"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                {t("tableENName")}
              </span>
              <span className="font-semibold text-foreground">
                {institution.nameEN || "—"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                {t("tableCountry")}
              </span>
              <span className="font-semibold text-foreground">
                {institution.country || "—"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                {t("website")}
              </span>
              {institution.url ? (
                <a
                  href={institution.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-brand-text hover:text-brand-text-hover hover:underline inline-flex items-center gap-1"
                >
                  <span>{institution.url}</span>
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              ) : (
                <span className="font-semibold text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
