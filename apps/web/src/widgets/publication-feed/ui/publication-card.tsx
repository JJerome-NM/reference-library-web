"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  BookOpen,
  RotateCw,
  AlertCircle,
  Users,
  Quote,
} from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import {
  usePublicationReferences,
  type FullPublicationDto,
  type PublicationReferenceItem,
} from "@/src/entities/publication"
import { cn } from "@workspace/ui/lib/utils"

interface PublicationCardProps {
  publication: FullPublicationDto
  referencesList?: PublicationReferenceItem[]
}

export function PublicationCard({
  publication,
  referencesList,
}: PublicationCardProps) {
  const t = useTranslations("publicationsFeed")
  const [copied, setCopied] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const {
    data: fetchedReferences,
    isLoading: isReferencesLoading,
    isError: isReferencesError,
    refetch,
  } = usePublicationReferences(publication.doi, isDrawerOpen && !referencesList)

  const references = referencesList ?? fetchedReferences ?? []

  async function handleCopyDoi() {
    await navigator.clipboard.writeText(publication.doi)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasReferences = publication.totalReferences > 0
  const referencesContainerId = `references-${publication.doi.replace(/[^a-zA-Z0-9_-]/g, "_")}`

  return (
    <article className="group rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 dark:bg-card/75 backdrop-blur-xs p-3.5 sm:p-4 shadow-2xs hover:border-blue-500/40 hover:shadow-xs transition-all space-y-2.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <BookOpen className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-blue-700 dark:text-blue-400 truncate hover:underline cursor-pointer">
            {publication.journal?.title ?? "Academic Journal"}
          </span>
        </div>

        {publication.publicationDate && (
          <span className="text-[11px] font-mono text-muted-foreground/80 shrink-0">
            {publication.publicationDate}
          </span>
        )}
      </div>

      <h3 className="text-[15px] sm:text-base font-semibold text-foreground leading-snug tracking-tight">
        <a
          href={`https://doi.org/${publication.doi}`}
          target="_blank"
          rel="noreferrer noopener"
          className="group/title inline-flex items-start gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span>{publication.name}</span>
          <ExternalLink
            className="size-3.5 text-muted-foreground/50 shrink-0 mt-0.5 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors"
            aria-hidden="true"
          />
        </a>
      </h3>

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
        <Users className="size-3.5 text-muted-foreground/60 shrink-0" aria-hidden="true" />
        <span className="text-muted-foreground/80 font-medium">{t("authors")}</span>
        {publication.authors.map((author, index) => {
          const authorName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
          const orcidPath = author.orcid ? author.orcid.split("/").pop() : ""

          return (
            <span key={author.orcid || index} className="inline-flex items-center">
              {orcidPath ? (
                <Link
                  href={`/authors/${orcidPath}/details`}
                  className="font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                >
                  {authorName}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{authorName}</span>
              )}
              {index < publication.authors.length - 1 && (
                <span className="text-muted-foreground/40 ml-1.5 mr-0.5 select-none">•</span>
              )}
            </span>
          )
        })}
      </div>

      <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 min-w-0 max-w-full">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 select-none">
            {t("doi")}
          </span>
          <span className="font-mono text-[11px] text-foreground truncate max-w-[200px] xs:max-w-[260px] sm:max-w-xs">
            {publication.doi}
          </span>
          <button
            type="button"
            onClick={handleCopyDoi}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 active:scale-95"
            title={copied ? t("doiCopied") : t("copyDoi")}
            aria-label={`${t("copyDoi")}: ${publication.doi}`}
          >
            {copied ? (
              <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="size-3" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/40 text-xs font-medium text-muted-foreground">
            <Quote className="size-3 text-muted-foreground/70 shrink-0" aria-hidden="true" />
            <span>{t("citationsShort")}</span>
            <strong className="font-mono text-foreground font-semibold">
              {publication.totalCitations}
            </strong>
          </span>

          {hasReferences ? (
            <button
              type="button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-expanded={isDrawerOpen}
              aria-controls={referencesContainerId}
              aria-label={`${t("referencesShort")} (${publication.totalReferences})`}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border transition-all active:scale-95 cursor-pointer select-none",
                isDrawerOpen
                  ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-600"
                  : "bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300"
              )}
            >
              <BookOpen className="size-3 shrink-0" aria-hidden="true" />
              <span>{t("referencesShort")}</span>
              <strong className="font-mono text-[11px]">
                {publication.totalReferences}
              </strong>
              <ChevronDown
                className={cn(
                  "size-3 shrink-0 transition-transform duration-150",
                  isDrawerOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/30 text-xs font-medium text-muted-foreground/70">
              <BookOpen className="size-3 text-muted-foreground/50 shrink-0" aria-hidden="true" />
              <span>{t("referencesShort")}</span>
              <strong className="font-mono font-normal">0</strong>
            </span>
          )}
        </div>
      </div>

      {hasReferences && isDrawerOpen && (
        <div id={referencesContainerId} className="pt-1.5">
          <div className="bg-muted/20 dark:bg-muted/10 rounded-xl p-3 border border-border/60 space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="size-3 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                {t("sourcesUsed")} ({references.length || publication.totalReferences})
              </span>
              <span className="text-[10px] text-muted-foreground/80 font-medium hidden sm:inline">
                {t("citedLiterature")}
              </span>
            </div>

            {isReferencesLoading ? (
              <div className="space-y-1.5" aria-busy="true">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-12 animate-pulse rounded-lg bg-card/80 border border-border/60"
                  />
                ))}
              </div>
            ) : isReferencesError ? (
              <div className="p-2.5 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>Не вдалося завантажити джерела</span>
                </div>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-1 font-semibold hover:underline cursor-pointer"
                >
                  <RotateCw className="size-3" aria-hidden="true" />
                  <span>Повторити</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {references.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-2.5 bg-card/90 dark:bg-card/75 rounded-lg border border-border/60 hover:border-blue-500/30 transition-colors flex items-start gap-2.5"
                  >
                    <span className="size-5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {ref.id}
                    </span>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="text-xs font-semibold text-foreground leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {ref.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-muted-foreground">
                        <span className="font-medium text-foreground">{ref.journal}</span>
                        <span className="text-muted-foreground/60">•</span>
                        <a
                          href={`https://doi.org/${ref.doi}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 font-mono text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <span>{ref.doi}</span>
                          <ExternalLink className="size-2.5 shrink-0" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  )
}
