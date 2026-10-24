import { queryOptions } from "@tanstack/react-query"
import { apiClient } from "@/src/shared/api/api-client"
import { CACHE_CONFIG } from "@/src/shared/config"
import type {
  FullPublicationDto,
  PublicationSearchPayload,
  PublicationsPage,
} from "./publication.types"
import {
  MOCK_PUBLICATIONS,
  filterMockPublications,
} from "./publication.mock"

class PublicationService {
  private url = "/publications"
  public queryKeys = ["publications"] as const

  getLatestQueryOptions(size = 5) {
    return queryOptions({
      queryKey: [...this.queryKeys, "latest", size],
      queryFn: (meta) => {
        return apiClient.get<FullPublicationDto[]>(`${this.url}/latest?size=${size}`, {
          signal: meta.signal,
          mockData: MOCK_PUBLICATIONS.slice(0, size),
          delayMs: 150,
        })
      },
      staleTime: CACHE_CONFIG.DETAILS_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }

  search(payload: PublicationSearchPayload = {}) {
    return apiClient.post<PublicationsPage>(`${this.url}/search`, payload, {
      mockData: filterMockPublications(payload),
      delayMs: 150,
    })
  }

  searchQueryOptions(payload: PublicationSearchPayload = {}) {
    return queryOptions({
      queryKey: [...this.queryKeys, "search-post", payload],
      queryFn: (meta) => {
        return apiClient.post<PublicationsPage>(`${this.url}/search`, payload, {
          signal: meta.signal,
          mockData: filterMockPublications(payload),
          delayMs: 150,
        })
      },
      staleTime: CACHE_CONFIG.SEARCH_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }
}

export const publicationService = new PublicationService()
