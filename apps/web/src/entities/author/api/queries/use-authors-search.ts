"use client"

import { useQuery } from "@tanstack/react-query"
import { authorService } from "../author.service"
import type { AuthorSearchPayload } from "../author.types"

export const useAuthorsSearch = (payload: AuthorSearchPayload = {}) => {
  const query = useQuery(authorService.searchQueryOptions(payload))
  return {
    authorsPage: query.data,
    authors: query.data?.content ?? [],
    totalElements: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    ...query,
  }
}
