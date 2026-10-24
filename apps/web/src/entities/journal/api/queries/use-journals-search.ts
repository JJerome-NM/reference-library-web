"use client"

import { useQuery } from "@tanstack/react-query"
import { journalService } from "../journal.service"
import type { JournalSearchPayload } from "../journal.types"

export const useJournalsSearch = (payload: JournalSearchPayload = {}) => {
  const query = useQuery(journalService.searchQueryOptions(payload))
  return {
    journalsPage: query.data,
    journals: query.data?.content ?? [],
    totalElements: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    ...query,
  }
}
