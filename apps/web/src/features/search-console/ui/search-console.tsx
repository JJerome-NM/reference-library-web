"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Search, Sparkles, HelpCircle } from "lucide-react"
import { useRouter } from "@/src/i18n/navigation"
import { Switch } from "@workspace/ui/components/switch"
import { Button } from "@workspace/ui/components/button"
import { usePublicationSearchParams } from "@/src/features/publication-search/model/use-publication-search-params"
import { sanitizeString } from "@/src/shared/lib/sanitizer"
import { cn } from "@workspace/ui/lib/utils"

export type EntityMode = "publication" | "author" | "journal" | "institution"

interface SearchConsoleProps {
  initialMode?: EntityMode
}

export function SearchConsole({ initialMode = "publication" }: SearchConsoleProps) {
  const t = useTranslations("search")
  const router = useRouter()
  const { q, semanticMode, updateParams } = usePublicationSearchParams()

  const [mode, setMode] = useState<EntityMode>(initialMode)
  const [prevQ, setPrevQ] = useState(q)
  const [inputValue, setInputValue] = useState(q)

  if (q !== prevQ) {
    setPrevQ(q)
    setInputValue(q)
  }

  const placeholder =
    mode === "author"
      ? t("placeholderAuthors")
      : mode === "journal"
        ? t("placeholderJournals")
        : mode === "institution"
          ? t("placeholderInstitutions")
          : t("placeholderPublications")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = sanitizeString(inputValue)
    if (mode === "author") {
      router.push(trimmed ? `/authors?q=${encodeURIComponent(trimmed)}` : "/authors")
    } else if (mode === "journal") {
      router.push(trimmed ? `/journals?q=${encodeURIComponent(trimmed)}` : "/journals")
    } else if (mode === "institution") {
      router.push(trimmed ? `/institutions?q=${encodeURIComponent(trimmed)}` : "/institutions")
    } else {
      updateParams({ q: trimmed || null, page: null })
    }
  }

  function handleModeChange(nextMode: EntityMode) {
    setMode(nextMode)
    const trimmed = sanitizeString(inputValue)
    if (nextMode === "author") {
      router.push(trimmed ? `/authors?q=${encodeURIComponent(trimmed)}` : "/authors")
    } else if (nextMode === "journal") {
      router.push(trimmed ? `/journals?q=${encodeURIComponent(trimmed)}` : "/journals")
    } else if (nextMode === "institution") {
      router.push(trimmed ? `/institutions?q=${encodeURIComponent(trimmed)}` : "/institutions")
    } else {
      router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/")
    }
  }

  function handleSemanticToggle(checked: boolean) {
    updateParams({ semantic: checked ? "true" : null, page: null })
  }

  return (
    <section className="bg-card rounded-2xl border border-border p-3 shadow-xs space-y-3">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <Search className="size-4 text-muted-foreground absolute left-3.5" aria-hidden="true" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-24 bg-muted/40 border border-border rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1.5 h-8 px-4 text-xs font-semibold rounded-lg shadow-2xs"
        >
          {t("searchButton")}
        </Button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/60 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
            {t("searchAs")}
          </span>
          <div className="flex items-center bg-muted p-0.5 rounded-lg border border-border/60 font-semibold text-[11px] overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => handleModeChange("publication")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors whitespace-nowrap",
                mode === "publication"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("publication")}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("author")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors whitespace-nowrap",
                mode === "author"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("author")}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("journal")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors whitespace-nowrap",
                mode === "journal"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("journal")}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("institution")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors whitespace-nowrap",
                mode === "institution"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("institution")}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0">
          <div className="flex items-center gap-2">
            <Switch
              size="sm"
              isSelected={semanticMode}
              onChange={handleSemanticToggle}
              aria-label={t("semanticMode")}
            />
            <div className="flex items-center gap-1 font-bold text-[11px] text-foreground select-none">
              <Sparkles className="size-3 text-indigo-500" aria-hidden="true" />
              <span>{t("semanticMode")}</span>
            </div>
          </div>

          <span
            className="text-muted-foreground hover:text-foreground cursor-help p-1"
            title={t("semanticTooltip")}
          >
            <HelpCircle className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </section>
  )
}
