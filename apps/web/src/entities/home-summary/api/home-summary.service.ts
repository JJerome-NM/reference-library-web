import { queryOptions } from "@tanstack/react-query"
import { apiClient } from "@/src/shared/api/api-client"
import { CACHE_CONFIG } from "@/src/shared/config"
import type { HomeSummaryDto } from "@/src/shared/api/types"
import { MOCK_HOME_SUMMARY } from "./home-summary.mock"

class HomeSummaryService {
  private url = "/stats/summary"
  public queryKeys = ["stats", "summary"] as const

  getSummaryQueryOptions() {
    return queryOptions({
      queryKey: [...this.queryKeys],
      queryFn: (meta) => {
        return apiClient.get<HomeSummaryDto>(this.url, {
          signal: meta.signal,
          mockData: MOCK_HOME_SUMMARY,
          delayMs: 200,
        })
      },
      staleTime: CACHE_CONFIG.SUMMARY_STALE_TIME,
      gcTime: CACHE_CONFIG.DEFAULT_GC_TIME,
    })
  }

  getSummary() {
    return apiClient.get<HomeSummaryDto>(this.url, {
      mockData: MOCK_HOME_SUMMARY,
      delayMs: 200,
    })
  }
}

export const homeSummaryService = new HomeSummaryService()
