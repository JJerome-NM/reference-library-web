import { queryOptions } from "@tanstack/react-query"
import { apiClient } from "@/src/shared/api/api-client"
import { CACHE_CONFIG } from "@/src/shared/config"
import type {
  InstitutionDetailsResponse,
  InstitutionSearchPayload,
  InstitutionsPage,
} from "./institution.types"
import {
  getMockInstitutionDetails,
  filterMockInstitutions,
} from "./institution.mock"

export const institutionKeys = {
  all: ["institutions"] as const,
  lists: () => [...institutionKeys.all, "list"] as const,
  searches: () => [...institutionKeys.all, "search"] as const,
  search: (payload: InstitutionSearchPayload = {}) =>
    [...institutionKeys.all, "search-post", payload] as const,
  details: () => [...institutionKeys.all, "details"] as const,
  detail: (id?: number | string, page = 0, sortOption?: string) =>
    [...institutionKeys.details(), id, page, sortOption] as const,
}

class InstitutionService {
  private url = "/institutions"
  public queryKeys = institutionKeys.all

  search(payload: InstitutionSearchPayload = {}) {
    return apiClient.post<InstitutionsPage>(`${this.url}/search`, payload, {
      mockData: filterMockInstitutions(payload),
      delayMs: 150,
    })
  }

  searchQueryOptions(payload: InstitutionSearchPayload = {}) {
    return queryOptions({
      queryKey: institutionKeys.search(payload),
      queryFn: (meta) => {
        return apiClient.post<InstitutionsPage>(`${this.url}/search`, payload, {
          signal: meta.signal,
          mockData: filterMockInstitutions(payload),
          delayMs: 150,
        })
      },
      staleTime: CACHE_CONFIG.SEARCH_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }

  getDetails(id: number | string, page = 0, sortOption?: string) {
    const endpoint = `${this.url}/${id}?page=${page}${sortOption ? `&sortOption=${sortOption}` : ""}`
    return apiClient.get<InstitutionDetailsResponse>(endpoint, {
      mockData: getMockInstitutionDetails(id, page, sortOption),
      delayMs: 150,
    })
  }

  getDetailsQueryOptions(id: number | string, page = 0, sortOption?: string) {
    return queryOptions({
      queryKey: institutionKeys.detail(id, page, sortOption),
      queryFn: (meta) => {
        const endpoint = `${this.url}/${id}?page=${page}${sortOption ? `&sortOption=${sortOption}` : ""}`
        return apiClient.get<InstitutionDetailsResponse>(endpoint, {
          signal: meta.signal,
          mockData: getMockInstitutionDetails(id, page, sortOption),
          delayMs: 150,
        })
      },
      enabled: Boolean(id),
      staleTime: CACHE_CONFIG.DETAILS_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }
}

export const institutionService = new InstitutionService()
