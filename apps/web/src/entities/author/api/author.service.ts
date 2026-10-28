import { queryOptions } from "@tanstack/react-query"
import { apiClient } from "@/src/shared/api/api-client"
import { CACHE_CONFIG } from "@/src/shared/config"
import type {
  AuthorDetailsParams,
  AuthorDetailsResponse,
  AuthorSearchPayload,
  AuthorsPage,
} from "./author.types"
import {
  getMockAuthorDetails,
  filterMockAuthors,
} from "./author.mock"

export const authorKeys = {
  all: ["authors"] as const,
  lists: () => [...authorKeys.all, "list"] as const,
  searches: () => [...authorKeys.all, "search"] as const,
  search: (payload: AuthorSearchPayload = {}) =>
    [...authorKeys.all, "search-post", payload] as const,
  details: () => [...authorKeys.all, "details"] as const,
  detail: (orcid?: string, params?: AuthorDetailsParams) =>
    [...authorKeys.details(), orcid, params] as const,
}

class AuthorService {
  private url = "/authors"
  public queryKeys = authorKeys.all

  search(payload: AuthorSearchPayload = {}) {
    return apiClient.post<AuthorsPage>(`${this.url}/search`, payload, {
      mockData: filterMockAuthors(payload),
      delayMs: 150,
    })
  }

  searchQueryOptions(payload: AuthorSearchPayload = {}) {
    return queryOptions({
      queryKey: authorKeys.search(payload),
      queryFn: (meta) => {
        return apiClient.post<AuthorsPage>(`${this.url}/search`, payload, {
          signal: meta.signal,
          mockData: filterMockAuthors(payload),
          delayMs: 150,
        })
      },
      staleTime: CACHE_CONFIG.SEARCH_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }

  getDetails(orcid?: string, params?: AuthorDetailsParams) {
    const queryParams = new URLSearchParams()
    if (params?.searchQuery) queryParams.set("searchQuery", params.searchQuery)
    if (params?.startDate) queryParams.set("startDate", params.startDate)
    if (params?.endDate) queryParams.set("endDate", params.endDate)
    params?.sortOption?.forEach((s) => queryParams.append("sortOption", s))

    const queryString = queryParams.toString()
    const endpoint = `${this.url}/${encodeURIComponent(orcid ?? "")}${
      queryString ? `?${queryString}` : ""
    }`

    return apiClient.get<AuthorDetailsResponse>(endpoint, {
      mockData: getMockAuthorDetails(orcid, params),
      delayMs: 200,
    })
  }

  getDetailsQueryOptions(orcid?: string, params?: AuthorDetailsParams) {
    return queryOptions({
      queryKey: authorKeys.detail(orcid, params),
      queryFn: (meta) => {
        const queryParams = new URLSearchParams()
        if (params?.searchQuery) queryParams.set("searchQuery", params.searchQuery)
        if (params?.startDate) queryParams.set("startDate", params.startDate)
        if (params?.endDate) queryParams.set("endDate", params.endDate)
        params?.sortOption?.forEach((s) => queryParams.append("sortOption", s))

        const queryString = queryParams.toString()
        const endpoint = `${this.url}/${encodeURIComponent(orcid ?? "")}${
          queryString ? `?${queryString}` : ""
        }`

        return apiClient.get<AuthorDetailsResponse>(endpoint, {
          signal: meta.signal,
          mockData: getMockAuthorDetails(orcid, params),
          delayMs: 200,
        })
      },
      enabled: Boolean(orcid),
      staleTime: CACHE_CONFIG.DETAILS_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }
}

export const authorService = new AuthorService()
