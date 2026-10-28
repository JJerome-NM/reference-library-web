import { queryOptions } from "@tanstack/react-query"
import { apiClient } from "@/src/shared/api/api-client"
import { CACHE_CONFIG } from "@/src/shared/config"
import type {
  FullPublicationDto,
  PublicationSearchPayload,
  PublicationsPage,
  PublicationReferenceItem,
} from "./publication.types"
import {
  MOCK_PUBLICATIONS,
  filterMockPublications,
  getMockPublicationReferences,
} from "./publication.mock"

export const publicationKeys = {
  all: ["publications"] as const,
  lists: () => [...publicationKeys.all, "list"] as const,
  latest: (size = 5) => [...publicationKeys.all, "latest", size] as const,
  searches: () => [...publicationKeys.all, "search"] as const,
  search: (payload: PublicationSearchPayload = {}) =>
    [...publicationKeys.all, "search-post", payload] as const,
  details: () => [...publicationKeys.all, "detail"] as const,
  detail: (doi: string) => [...publicationKeys.details(), doi] as const,
  references: (doi: string) => [...publicationKeys.detail(doi), "references"] as const,
  citations: (doi: string) => [...publicationKeys.detail(doi), "citations"] as const,
}

class PublicationService {
  private url = "/publications"
  public queryKeys = publicationKeys.all

  getLatestQueryOptions(size = 5) {
    return queryOptions({
      queryKey: publicationKeys.latest(size),
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
      queryKey: publicationKeys.search(payload),
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

  getReferencesQueryOptions(doi: string) {
    return queryOptions({
      queryKey: publicationKeys.references(doi),
      queryFn: (meta) => {
        return apiClient.get<PublicationReferenceItem[]>(
          `${this.url}/${encodeURIComponent(doi)}/references`,
          {
            signal: meta.signal,
            mockData: getMockPublicationReferences(),
            delayMs: 200,
          }
        )
      },
      staleTime: CACHE_CONFIG.DETAILS_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }
}

export const publicationService = new PublicationService()
