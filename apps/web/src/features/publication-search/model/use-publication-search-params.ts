"use client"

import { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/src/i18n/navigation"
import { PAGINATION_CONFIG } from "@/src/shared/config"
import { sanitizeNumericParam, sanitizeString } from "@/src/shared/lib/sanitizer"
import {
  sortOptionSchema,
  type PublicationSearchPayload,
  type SortOption,
} from "@/src/entities/publication"

export function usePublicationSearchParams() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const rawQ = searchParams.get("q") ?? ""
  const q = sanitizeString(rawQ)
  const yearFromStr = searchParams.get("from")
  const yearToStr = searchParams.get("to")
  const journalsParam = searchParams.get("journals")
  const onlyCitationsParam = searchParams.get("citations")
  const onlyRefsParam = searchParams.get("refs")
  const semanticParam = searchParams.get("semantic")
  const rawSort = searchParams.get("sort")
  const sortParsed = sortOptionSchema.safeParse(rawSort)
  const sortParam: SortOption = sortParsed.success ? sortParsed.data : "DATE_DESC"
  const pageParam = searchParams.get("page")

  const yearFrom = sanitizeNumericParam(yearFromStr, undefined, 1900, 2100)
  const yearTo = sanitizeNumericParam(yearToStr, undefined, 1900, 2100)
  const selectedJournals = journalsParam
    ? journalsParam
        .split(",")
        .map((j) => sanitizeString(j))
        .filter(Boolean)
    : []
  const onlyWithCitations = onlyCitationsParam === "true"
  const onlyWithReferences = onlyRefsParam === "true"
  const semanticMode = semanticParam === "true"
  const page = Math.max(1, sanitizeNumericParam(pageParam, 1, 1, 10000) ?? 1)

  const payload: PublicationSearchPayload = {
    searchQuery: q || undefined,
    yearFrom,
    yearTo,
    journals: selectedJournals.length > 0 ? selectedJournals : undefined,
    onlyWithCitations,
    onlyWithReferences,
    semanticMode,
    sortOption: sortParam,
    page: page - 1,
    size: PAGINATION_CONFIG.PUBLICATIONS_PAGE_SIZE,
  }

  function updateParams(
    updates: Record<string, string | number | boolean | null | undefined>
  ) {
    const next = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    })

    if (!("page" in updates)) {
      next.delete("page")
    }

    startTransition(() => {
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  function toggleJournal(journalTitle: string) {
    const current = new Set(selectedJournals)
    if (current.has(journalTitle)) {
      current.delete(journalTitle)
    } else {
      current.add(journalTitle)
    }
    const joined = Array.from(current).join(",")
    updateParams({ journals: joined || null, page: null })
  }

  function clearAll() {
    startTransition(() => {
      router.replace(pathname)
    })
  }

  return {
    q,
    yearFrom,
    yearTo,
    selectedJournals,
    onlyWithCitations,
    onlyWithReferences,
    semanticMode,
    sortOption: sortParam,
    page,
    payload,
    isPending,
    updateParams,
    toggleJournal,
    clearAll,
  }
}
