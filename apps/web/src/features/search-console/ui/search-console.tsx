"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Search,
  Sparkles,
  X,
  FileText,
  Users,
  BookOpen,
  Building2,
} from "lucide-react"
import { usePathname, useRouter } from "@/src/i18n/navigation"
import { sanitizeString } from "@/src/shared/lib/sanitizer"
import { cn } from "@workspace/ui/lib/utils"

export type EntityMode = "publication" | "author" | "journal" | "institution"

export interface SearchConsoleProps {
  initialMode?: EntityMode
  showEntitySwitch?: boolean
  showSemanticToggle?: boolean
  placeholder?: string
  className?: string
  onSearch?: (query: string, mode: EntityMode) => void
}

const ENTITY_ITEMS: Array<{
  key: EntityMode
  labelKey: "publication" | "author" | "journal" | "institution"
  icon: React.ComponentType<{ className?: string }>
}> = [
  { key: "publication", labelKey: "publication", icon: FileText },
  { key: "author", labelKey: "author", icon: Users },
  { key: "journal", labelKey: "journal", icon: BookOpen },
  { key: "institution", labelKey: "institution", icon: Building2 },
]

function getModeFromPathname(path: string): EntityMode {
  if (path.includes("/authors")) return "author"
  if (path.includes("/journals")) return "journal"
  if (path.includes("/institutions")) return "institution"
  return "publication"
}

export function SearchConsole({
  initialMode,
  showEntitySwitch = true,
  showSemanticToggle,
  placeholder: customPlaceholder,
  className,
  onSearch,
}: SearchConsoleProps) {
  const t = useTranslations("search")
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const detectedMode = initialMode ?? getModeFromPathname(pathname)
  const [mode, setMode] = useState<EntityMode>(detectedMode)
  const [prevDetectedMode, setPrevDetectedMode] = useState(detectedMode)

  if (detectedMode !== prevDetectedMode) {
    setPrevDetectedMode(detectedMode)
    setMode(detectedMode)
  }

  const rawQ = searchParams.get("q") ?? searchParams.get("searchQuery") ?? ""
  const sanitizedQ = sanitizeString(rawQ)

  const [inputValue, setInputValue] = useState(sanitizedQ)
  const [prevSanitizedQ, setPrevSanitizedQ] = useState(sanitizedQ)

  if (sanitizedQ !== prevSanitizedQ) {
    setPrevSanitizedQ(sanitizedQ)
    setInputValue(sanitizedQ)
  }

  const semanticMode = searchParams.get("semantic") === "true"
  const isSemanticAvailable = mode === "publication"
  const shouldShowSemantic =
    showSemanticToggle !== undefined ? showSemanticToggle : isSemanticAvailable

  const placeholder =
    customPlaceholder ??
    (mode === "author"
      ? t("placeholderAuthors")
      : mode === "journal"
        ? t("placeholderJournals")
        : mode === "institution"
          ? t("placeholderInstitutions")
          : t("placeholderPublications"))

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = sanitizeString(inputValue)

    if (onSearch) {
      onSearch(trimmed, mode)
      return
    }

    const targetPath =
      mode === "author"
        ? "/authors"
        : mode === "journal"
          ? "/journals"
          : mode === "institution"
            ? "/institutions"
            : "/"

    const isSameRoute = pathname === targetPath || (targetPath === "/" && pathname === "")

    const nextParams = new URLSearchParams(isSameRoute ? searchParams.toString() : "")
    if (trimmed) {
      nextParams.set("q", trimmed)
    } else {
      nextParams.delete("q")
      nextParams.delete("searchQuery")
    }
    nextParams.delete("page")

    const qs = nextParams.toString()
    router.push(qs ? `${targetPath}?${qs}` : targetPath)
  }

  function handleClear() {
    setInputValue("")
    const targetPath =
      mode === "author"
        ? "/authors"
        : mode === "journal"
          ? "/journals"
          : mode === "institution"
            ? "/institutions"
            : "/"

    const isSameRoute = pathname === targetPath || (targetPath === "/" && pathname === "")
    if (isSameRoute && (searchParams.has("q") || searchParams.has("searchQuery"))) {
      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.delete("q")
      nextParams.delete("searchQuery")
      nextParams.delete("page")
      const qs = nextParams.toString()
      router.push(qs ? `${targetPath}?${qs}` : targetPath)
    }
  }

  function handleModeChange(nextMode: EntityMode) {
    setMode(nextMode)
    const trimmed = sanitizeString(inputValue)
    const targetPath =
      nextMode === "author"
        ? "/authors"
        : nextMode === "journal"
          ? "/journals"
          : nextMode === "institution"
            ? "/institutions"
            : "/"

    const qs = trimmed ? `?q=${encodeURIComponent(trimmed)}` : ""
    router.push(`${targetPath}${qs}`)
  }

  function handleSemanticToggle(checked: boolean) {
    const nextParams = new URLSearchParams(searchParams.toString())
    if (checked) {
      nextParams.set("semantic", "true")
    } else {
      nextParams.delete("semantic")
    }
    nextParams.delete("page")
    const qs = nextParams.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <section
      className={cn(
        "group relative rounded-2xl border bg-card/95 dark:bg-card/85 backdrop-blur-md p-2.5 sm:p-3.5 shadow-xs transition-all duration-200",
        semanticMode && shouldShowSemantic
          ? "border-indigo-500/40 shadow-indigo-500/5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
          : "border-border/80 hover:border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
        className
      )}
      aria-label="Search Console"
    >
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative flex items-center gap-2.5 px-2 py-1">
          <Search
            className={cn(
              "size-5 transition-colors shrink-0",
              semanticMode && shouldShowSemantic
                ? "text-indigo-500"
                : "text-muted-foreground group-focus-within:text-foreground"
            )}
            aria-hidden="true"
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur()
              }
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className="flex-1 bg-transparent text-sm sm:text-base font-normal text-foreground placeholder:text-muted-foreground/70 outline-none border-0 min-w-0"
          />

          {inputValue.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label={t("clearSearch")}
              className="p-1 rounded-full text-muted-foreground/70 hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer select-none shrink-0"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-xl bg-muted/30 dark:bg-muted/20 border border-border/40">
          {showEntitySwitch && (
            <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider px-1 hidden md:inline select-none">
                {t("searchAs")}
              </span>
              {ENTITY_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = mode === item.key
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleModeChange(item.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer select-none",
                      isActive
                        ? "bg-background text-foreground shadow-2xs font-semibold ring-1 ring-border/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>{t(item.labelKey)}</span>
                  </button>
                )
              })}
            </div>
          )}

          <div className="flex items-center gap-1.5 ml-auto w-full sm:w-auto justify-end">
            {shouldShowSemantic && (
              <button
                type="button"
                onClick={() => handleSemanticToggle(!semanticMode)}
                aria-pressed={semanticMode}
                title={t("semanticTooltip")}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all select-none cursor-pointer border",
                  semanticMode
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 shadow-2xs ring-1 ring-indigo-500/20"
                    : "bg-background/70 dark:bg-background/40 border-border/50 text-muted-foreground hover:text-foreground hover:bg-background"
                )}
              >
                <Sparkles
                  className={cn(
                    "size-3.5 transition-colors shrink-0",
                    semanticMode
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                <span className="font-semibold">{t("semanticMode")}</span>
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-colors shrink-0",
                    semanticMode ? "bg-indigo-500 animate-pulse" : "bg-muted-foreground/30"
                  )}
                  aria-hidden="true"
                />
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs transition-all cursor-pointer active:scale-95 select-none shrink-0"
            >
              <Search className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{t("searchButton")}</span>
              <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-1 bg-primary-foreground/15 rounded text-primary-foreground/90 ml-0.5">
                ↵
              </kbd>
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
