"use client"

import { useQuery } from "@tanstack/react-query"
import { homeSummaryService } from "../home-summary.service"

export const useHomeSummary = () => {
  const query = useQuery(homeSummaryService.getSummaryQueryOptions())
  return { summary: query.data, ...query }
}
