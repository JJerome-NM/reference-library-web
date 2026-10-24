"use client"

import { useQuery } from "@tanstack/react-query"
import { journalService } from "../journal.service"

export const useJournalDetails = (issn?: string) => {
  return useQuery(journalService.getDetailsQueryOptions(issn))
}
