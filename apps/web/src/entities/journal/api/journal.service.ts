import { queryOptions } from "@tanstack/react-query"
import { apiClient } from "@/src/shared/api/api-client"
import { CACHE_CONFIG } from "@/src/shared/config"
import type {
  JournalDetailsResponse,
  JournalSearchPayload,
  JournalsPage,
} from "./journal.types"
import {
  getMockJournalDetails,
  filterMockJournals,
} from "./journal.mock"

class JournalService {
  private url = "/journals"
  public queryKeys = ["journals"] as const

  search(payload: JournalSearchPayload = {}) {
    return apiClient.post<JournalsPage>(`${this.url}/search`, payload, {
      mockData: filterMockJournals(payload),
      delayMs: 150,
    })
  }

  searchQueryOptions(payload: JournalSearchPayload = {}) {
    return queryOptions({
      queryKey: [...this.queryKeys, "search-post", payload],
      queryFn: (meta) => {
        return apiClient.post<JournalsPage>(`${this.url}/search`, payload, {
          signal: meta.signal,
          mockData: filterMockJournals(payload),
          delayMs: 150,
        })
      },
      staleTime: CACHE_CONFIG.SEARCH_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }

  getDetails(issn?: string) {
    const endpoint = `${this.url}/${encodeURIComponent(issn ?? "")}`
    return apiClient.get<JournalDetailsResponse>(endpoint, {
      mockData: getMockJournalDetails(issn),
      delayMs: 150,
    })
  }

  getDetailsQueryOptions(issn?: string) {
    return queryOptions({
      queryKey: [...this.queryKeys, "details", issn],
      queryFn: (meta) => {
        const endpoint = `${this.url}/${encodeURIComponent(issn ?? "")}`
        return apiClient.get<JournalDetailsResponse>(endpoint, {
          signal: meta.signal,
          mockData: getMockJournalDetails(issn),
          delayMs: 150,
        })
      },
      enabled: Boolean(issn),
      staleTime: CACHE_CONFIG.DETAILS_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }
}

export const journalService = new JournalService()
