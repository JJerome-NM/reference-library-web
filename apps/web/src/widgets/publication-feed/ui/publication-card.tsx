"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { BookMarked, ExternalLink, Copy, Check, ChevronDown, BookOpen } from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import type { FullPublicationDto } from "@/src/entities/publication"
import { cn } from "@workspace/ui/lib/utils"

interface ReferenceItem {
  id: number
  title: string
  journal: string
  doi: string
}

interface PublicationCardProps {
  publication: FullPublicationDto
  referencesList?: ReferenceItem[]
}

const SAMPLE_REFERENCES: ReferenceItem[] = [
  {
    id: 1,
    title: "Phase stability and microstructural transitions in high-entropy multicomponent systems",
    journal: "Acta Materialia",
    doi: "10.1016/j.actamat.2024.119874",
  },
  {
    id: 2,
    title: "Microstructural features and consolidation mechanics of warm-pressed refractory alloys",
    journal: "Materials Science and Engineering: A",
    doi: "10.1016/j.msea.2025.145120",
  },
  {
    id: 3,
    title: "Kinetic models and numerical simulation of solid-state interdiffusion under quasi-static stress",
    journal: "Metallurgical and Materials Transactions A",
    doi: "10.1016/j.msea.2025.145120",
  },
]

export function PublicationCard({
  publication,
  referencesList = SAMPLE_REFERENCES,
}: PublicationCardProps) {
  const t = useTranslations("publicationsFeed")
  const [copied, setCopied] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  async function handleCopyDoi() {
    await navigator.clipboard.writeText(publication.doi)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasReferences = publication.totalReferences > 0

  return (
    <article className="bg-card rounded-2xl border border-border p-5 shadow-xs hover:border-border/80 hover:shadow-md transition-all space-y-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold text-foreground flex items-center gap-1.5">
          <BookMarked className="size-3.5 text-blue-600" aria-hidden="true" />
          {publication.journal?.title ?? "Academic Journal"}
        </span>
        <span className="text-muted-foreground/60">•</span>
        <span className="text-muted-foreground font-mono text-[11px]">
          {t("publishedOn")} {publication.publicationDate}
        </span>
      </div>

      <h3 className="font-serif text-[17px] font-medium text-foreground leading-snug tracking-tight hover:text-blue-600 transition-colors">
        <a
          href={`https://doi.org/${publication.doi}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1"
        >
          <span>{publication.name}</span>
          <ExternalLink className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
        </a>
      </h3>

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
        <span className="font-bold text-foreground">{t("authors")}</span>
        {publication.authors.map((author, index) => {
          const authorName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
          const orcidPath = author.orcid ? author.orcid.split("/").pop() : ""

          return (
            <span key={author.orcid || index} className="inline-flex items-center">
              {orcidPath ? (
                <Link
                  href={`/authors/${orcidPath}/details`}
                  className="font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                >
                  {authorName}
                </Link>
              ) : (
                <span className="text-foreground">{authorName}</span>
              )}
              {index < publication.authors.length - 1 && <span className="mr-1">,</span>}
            </span>
          )
        })}
      </div>

      <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-muted-foreground">{t("doi")}</span>
          <button
            type="button"
            onClick={handleCopyDoi}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-foreground bg-muted/50 hover:bg-muted border border-border px-2 py-0.5 rounded-lg transition-colors group"
            title={t("copyDoi")}
          >
            <span>{publication.doi}</span>
            {copied ? (
              <Check className="size-3 text-emerald-600" aria-hidden="true" />
            ) : (
              <Copy className="size-3 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/40 border border-border/60 px-2.5 py-1 rounded-lg">
            <span>{t("citations")}</span>
            <strong className="font-mono text-foreground font-bold">
              {publication.totalCitations}
            </strong>
          </span>

          {hasReferences ? (
            <button
              type="button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/70 dark:border-blue-800/70 px-2.5 py-1 rounded-lg transition-all active:scale-95"
            >
              <span>{t("references")}</span>
              <strong className="font-mono">{publication.totalReferences}</strong>
              <ChevronDown
                className={cn("size-3 transition-transform", isDrawerOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/40 border border-border/60 px-2.5 py-1 rounded-lg">
              <span>{t("references")}</span>
              <strong className="font-mono text-foreground font-bold">0</strong>
            </span>
          )}
        </div>
      </div>

      {hasReferences && isDrawerOpen && (
        <div className="pt-2">
          <div className="bg-muted/30 rounded-xl p-3.5 border border-border/70 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="size-3 text-blue-600" aria-hidden="true" />
                {t("sourcesUsed")} ({referencesList.length})
              </span>
              <span className="text-[10px] text-muted-foreground">
                {t("citedLiterature")}
              </span>
            </div>

            <div className="space-y-1.5">
              {referencesList.map((ref) => (
                <div
                  key={ref.id}
                  className="p-2.5 bg-card rounded-lg border border-border hover:border-blue-200 hover:shadow-xs transition-all flex items-start gap-2.5"
                >
                  <span className="size-5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {ref.id}
                  </span>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="text-xs font-semibold text-foreground leading-snug line-clamp-1 hover:text-blue-600">
                      {ref.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-muted-foreground">
                      <span className="font-medium text-foreground">{ref.journal}</span>
                      <span className="text-muted-foreground/60">•</span>
                      <a
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 font-mono text-blue-600 hover:underline"
                      >
                        {ref.doi}
                        <ExternalLink className="size-2.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
