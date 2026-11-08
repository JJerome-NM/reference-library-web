"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  ExternalLink,
  Copy,
  Check,
  Share2,
  Layers,
  Users,
  Calendar,
  Sparkles,
  FileText,
} from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import type { JournalDetailsResponse } from "@/src/entities/journal"

function OrcidIcon() {
  return (
    <svg className="size-3.5 fill-[#A6CE39] shrink-0" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0ZM86.35,186.29H67.11V79.71H86.35Zm-9.62-120a11.19,11.19,0,1,1,11.19-11.19A11.19,11.19,0,0,1,76.73,66.29ZM197.89,141a38.41,38.41,0,0,1-13.43,29.93c-9.52,8.34-22.78,12.56-39.77,12.56H111.41V79.71h35.83c16.14,0,28.84,4.28,38.09,12.84A41,41,0,0,1,197.89,141Zm-20.1,0a24.16,24.16,0,0,0-7-18.08c-4.66-4.52-11.39-6.81-20.19-6.81h-19.1v49.8h19.1c9,0,15.82-2.35,20.45-7.05A24.47,24.47,0,0,0,177.79,141Z" />
    </svg>
  )
}

interface JournalProfileSidebarProps {
  data: JournalDetailsResponse
}

export function JournalProfileSidebar({ data }: JournalProfileSidebarProps) {
  const t = useTranslations("journalsPage")
  const { journal } = data
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [shared, setShared] = useState(false)

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  const latestVersion =
    journal.journalVersions.length > 0
      ? [...journal.journalVersions].sort((a, b) => {
          if (a.versionNumber !== null && b.versionNumber !== null) {
            return b.versionNumber - a.versionNumber
          }
          return (b.publishedDate ?? "").localeCompare(a.publishedDate ?? "")
        })[0]
      : null

  const topAuthors = [...journal.authors]
    .sort((a, b) => (b.academicIndex ?? 0) - (a.academicIndex ?? 0))
    .slice(0, 4)

  return (
    <div className="space-y-3.5">
      <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Sparkles className="size-3.5 text-brand-text" aria-hidden="true" />
            <span>{t("passportTitle")}</span>
          </span>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>{t("verifiedJournal")}</span>
          </span>
        </div>

        <div className="space-y-2">
          {journal.printIssn && (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-well border border-well-border text-xs">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  {t("printIssn")}
                </span>
                <span className="font-mono text-xs font-semibold text-foreground truncate block">
                  {journal.printIssn}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(journal.printIssn!, "pissn")}
                className="size-7 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Copy print ISSN"
              >
                {copiedId === "pissn" ? (
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="size-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          )}

          {journal.onlineIssn && (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-well border border-well-border text-xs">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-bold text-brand-text block">
                  {t("onlineIssn")}
                </span>
                <span className="font-mono text-xs font-semibold text-foreground truncate block">
                  {journal.onlineIssn}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(journal.onlineIssn!, "eissn")}
                className="size-7 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Copy online ISSN"
              >
                {copiedId === "eissn" ? (
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="size-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-border/50">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 min-h-8 max-h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer select-none"
          >
            {shared ? (
              <>
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t("shared")}</span>
              </>
            ) : (
              <>
                <Share2 className="size-3 text-brand-text" aria-hidden="true" />
                <span>{t("share")}</span>
              </>
            )}
          </button>

          <Link
            href={`/publications?journals=${encodeURIComponent(journal.title ?? "")}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 min-h-8 max-h-8 px-2.5 rounded-lg border border-brand-border bg-brand-subtle hover:bg-brand-subtle/80 text-brand-subtle-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95 text-center truncate"
          >
            <FileText className="size-3 text-brand-text shrink-0" aria-hidden="true" />
            <span className="truncate">{t("allJournalArticles")}</span>
          </Link>
        </div>
      </div>

      {latestVersion && (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Layers className="size-3.5 text-brand-text" aria-hidden="true" />
              <span>{t("latestIssue")}</span>
            </span>
            <span className="text-[10px] font-mono font-bold bg-brand-subtle text-brand-subtle-foreground border border-brand-border px-2 py-0.5 rounded-md">
              № {latestVersion.versionNumber ?? "—"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {latestVersion.publishedDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-3.5 text-brand-text shrink-0" aria-hidden="true" />
                <span>{t("publishedDate")} {latestVersion.publishedDate}</span>
              </div>
            )}

            {latestVersion.doi && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-well border border-well-border">
                <span className="font-mono text-[11px] text-brand-text truncate">
                  {latestVersion.doi}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(latestVersion.doi, "latest_doi")}
                  className="size-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                  aria-label="Copy DOI"
                >
                  {copiedId === "latest_doi" ? (
                    <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Copy className="size-3" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {topAuthors.length > 0 && (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Users className="size-3.5 text-brand-text" aria-hidden="true" />
              <span>{t("topAuthors")}</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-muted-foreground">
              {journal.authors.length}
            </span>
          </div>

          <div className="space-y-2">
            {topAuthors.map((author, idx) => {
              const fullName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
              const cleanOrcid = (author.orcid ?? "").replace("https://orcid.org/", "")
              const formattedIndex =
                author.academicIndex !== null && author.academicIndex !== undefined
                  ? author.academicIndex.toFixed(2).replace(".", ",")
                  : "—"

              return (
                <div
                  key={author.orcid}
                  className="p-2 rounded-xl bg-well border border-well-border hover:border-brand-border transition-colors flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-5 rounded-full bg-muted font-mono text-[10px] font-bold text-foreground flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <Link
                        href={`/authors/${cleanOrcid}/details`}
                        className="font-semibold text-xs text-foreground hover:text-brand-text truncate block transition-colors"
                      >
                        {fullName || cleanOrcid}
                      </Link>
                      <a
                        href={author.orcid}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground"
                      >
                        <OrcidIcon />
                        <span>{cleanOrcid}</span>
                        <ExternalLink className="size-2.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-brand-subtle-foreground bg-brand-subtle border border-brand-border px-1.5 py-0.5 rounded-md shrink-0">
                    {formattedIndex}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
