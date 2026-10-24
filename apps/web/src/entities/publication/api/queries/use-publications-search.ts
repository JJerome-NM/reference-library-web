"use client"

import { useQuery } from "@tanstack/react-query"
import { publicationService } from "../publication.service"
import type { PublicationSearchPayload } from "../publication.types"

export const usePublicationsSearch = (payload: PublicationSearchPayload = {}) => {
  const query = useQuery(publicationService.searchQueryOptions(payload))
  return {
    publicationsPage: query.data,
    publications: query.data?.content ?? [],
    totalElements: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    ...query,
  }
}
