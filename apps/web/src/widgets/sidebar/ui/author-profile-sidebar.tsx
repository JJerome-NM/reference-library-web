"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  ExternalLink,
  Copy,
  Check,
  Share2,
  Download,
  Loader2,
  Users,
  Award,
  Sparkles,
} from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import type { AuthorDetailsResponse } from "@/src/entities/author"

function OrcidIcon() {
  return (
    <svg className="size-3.5 fill-[#A6CE39] shrink-0" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0ZM86.35,186.29H67.11V79.71H86.35Zm-9.62-120a11.19,11.19,0,1,1,11.19-11.19A11.19,11.19,0,0,1,76.73,66.29ZM197.89,141a38.41,38.41,0,0,1-13.43,29.93c-9.52,8.34-22.78,12.56-39.77,12.56H111.41V79.71h35.83c16.14,0,28.84,4.28,38.09,12.84A41,41,0,0,1,197.89,141Zm-20.1,0a24.16,24.16,0,0,0-7-18.08c-4.66-4.52-11.39-6.81-20.19-6.81h-19.1v49.8h19.1c9,0,15.82-2.35,20.45-7.05A24.47,24.47,0,0,0,177.79,141Z" />
    </svg>
  )
}

interface AuthorProfileSidebarProps {
  data: AuthorDetailsResponse
}

export function AuthorProfileSidebar({ data }: AuthorProfileSidebarProps) {
  const t = useTranslations("authorsPage")
  const { author, statistics, publications } = data
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [shared, setShared] = useState(false)
  const [bibtexStatus, setBibtexStatus] = useState<"idle" | "loading" | "success">("idle")

  const cleanOrcid = (author.orcid ?? "").replace("https://orcid.org/", "")

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

  const topCoAuthors = statistics?.coAuthors?.slice(0, 4) ?? []

  return (
    <div className="space-y-3.5">
      <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Sparkles className="size-3.5 text-brand-text" aria-hidden="true" />
            <span>{t("identifiers")}</span>
          </span>
          {author.numberInRating !== null && author.numberInRating !== undefined && (
            <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Award className="size-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span>#{author.numberInRating}</span>
            </span>
          )}
        </div>

        <div className="space-y-2 text-xs">
          {cleanOrcid && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-well border border-well-border">
              <div className="flex items-center gap-2 min-w-0">
                <OrcidIcon />
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block font-bold leading-none">ORCID</span>
                  <a
                    href={`https://orcid.org/${cleanOrcid}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-xs font-semibold text-foreground hover:text-brand-text hover:underline truncate block"
                  >
                    {cleanOrcid}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(cleanOrcid, "orcid")}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors cursor-pointer"
                  aria-label="Copy ORCID"
                >
                  {copiedId === "orcid" ? (
                    <Check className="size-3 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy className="size-3" aria-hidden="true" />
                  )}
                </button>
                <a
                  href={`https://orcid.org/${cleanOrcid}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                  aria-label="Open ORCID"
                >
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          )}

          {author.importedBy && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-well border border-well-border">
              <span className="text-[10px] text-muted-foreground font-bold">Джерело</span>
              <span className="font-mono text-xs font-semibold text-foreground">{author.importedBy}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border/50 flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 min-h-8 max-h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer select-none"
          >
            {shared ? (
              <>
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t("copied")}</span>
              </>
            ) : (
              <>
                <Share2 className="size-3 text-brand-text" aria-hidden="true" />
                <span>{t("share")}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportBibtex}
            disabled={bibtexStatus === "loading"}
            className="relative overflow-hidden flex-1 inline-flex items-center justify-center gap-1.5 h-8 min-h-8 max-h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer select-none disabled:opacity-80 disabled:cursor-wait"
          >
            {bibtexStatus === "loading" && (
              <span className="absolute bottom-0 left-0 h-[2px] bg-brand animate-pulse w-full" aria-hidden="true" />
            )}
            {bibtexStatus === "success" ? (
              <>
                <Check className="size-3 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-75 duration-200" aria-hidden="true" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t("downloadedExcel")}</span>
              </>
            ) : bibtexStatus === "loading" ? (
              <>
                <Loader2 className="size-3 animate-spin text-brand-text shrink-0" aria-hidden="true" />
                <span className="text-muted-foreground">{t("downloadingExcel")}</span>
              </>
            ) : (
              <>
                <Download className="size-3 text-brand-text" aria-hidden="true" />
                <span>BibTeX</span>
              </>
            )}
          </button>
        </div>
      </div>

      {topCoAuthors.length > 0 && (
        <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Users className="size-3.5 text-brand-text" aria-hidden="true" />
              <span>{t("topCoAuthors")}</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-muted-foreground">
              {statistics?.coAuthors?.length ?? 0}
            </span>
          </div>

          <div className="space-y-2">
            {topCoAuthors.map((co) => {
              const coCleanOrcid = (co.orcid ?? "").replace("https://orcid.org/", "")
              const coName = `${co.firstName ?? ""} ${co.lastName ?? ""}`.trim()
              const coIndex =
                co.academicIndex !== null && co.academicIndex !== undefined
                  ? co.academicIndex.toFixed(2).replace(".", ",")
                  : "—"

              return (
                <div
                  key={co.orcid}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-well border border-well-border text-xs group hover:border-brand-border transition-colors"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/authors/${coCleanOrcid}/details`}
                      className="font-bold text-foreground hover:text-brand-text truncate block leading-tight"
                    >
                      {coName || coCleanOrcid}
                    </Link>
                    {coCleanOrcid && (
                      <span className="text-[10px] font-mono text-muted-foreground truncate block">
                        {coCleanOrcid}
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-[11px] font-bold text-brand-subtle-foreground bg-brand-subtle border border-brand-border px-1.5 py-0.5 rounded-md shrink-0">
                    {coIndex}
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
