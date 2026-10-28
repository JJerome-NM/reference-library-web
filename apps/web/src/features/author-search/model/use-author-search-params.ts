"use client"

import { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/src/i18n/navigation"
import { PAGINATION_CONFIG } from "@/src/shared/config"
import { sanitizeNumericParam, sanitizeString } from "@/src/shared/lib/sanitizer"
import {
  authorSortOptionSchema,
  type AuthorSearchPayload,
  type AuthorSortOption,
} from "@/src/entities/author"

export function useAuthorSearchParams() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const rawQ = searchParams.get("q") ?? searchParams.get("searchQuery") ?? ""
  const q = sanitizeString(rawQ)
  const indexFromStr = searchParams.get("from")
  const indexToStr = searchParams.get("to")
  const orcidParam = searchParams.get("orcid")
  const activePubsParam = searchParams.get("activePubs")
  const rawSort = searchParams.get("sort")
  const sortParsed = authorSortOptionSchema.safeParse(rawSort)
  const sortParam: AuthorSortOption = sortParsed.success ? sortParsed.data : "INDEX_DESC"
  const pageParam = searchParams.get("page")

  const indexFrom = sanitizeNumericParam(indexFromStr, undefined, 0, 100)
  const indexTo = sanitizeNumericParam(indexToStr, undefined, 0, 100)
  const onlyOrcid = orcidParam === "true"
  const onlyActivePubs = activePubsParam === "true"
  const page = Math.max(1, sanitizeNumericParam(pageParam, 1, 1, 10000) ?? 1)

  const payload: AuthorSearchPayload = {
    searchQuery: q || undefined,
    indexFrom,
    indexTo,
    onlyOrcid,
    onlyActivePubs,
    sortOption: sortParam,
    page: page - 1,
    size: PAGINATION_CONFIG.AUTHORS_PAGE_SIZE,
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
      next.delete("searchQuery")
    }

    startTransition(() => {
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  function clearAll() {
    startTransition(() => {
      router.replace(pathname)
    })
  }

  return {
    q,
    indexFrom,
    indexTo,
    onlyOrcid,
    onlyActivePubs,
    sortOption: sortParam,
    page,
    payload,
    isPending,
    updateParams,
    clearAll,
  }
}
